module.exports = (app, express, loadUser, Directory, Feeds, moment, request, async, parser, ObjectID) ->

  app.post '/directory/subscribe/:uuid', loadUser, (req, res) ->
    Directory.findOne { 'uuid': req.params.uuid }, (err, result) ->
      if (err)
        throw err

      # If the user is viewing the directory while not logged in.
      if harkUser is false
        res.status(500)
        req.session.messages = 'You need to be logged in to do that! Please <a href="/login/">log in</a> or <a href="/signup/">create an account</a>.'
        res.render 'layout/modal',
          messages : req.session.messages
        return

      # As long as harkUser isn't false, we will continue.
      # First, we search for an existing subscription. If there is one, we stop. 
      # If there isn't, we go ahead and add it.
      Feeds.findOne { 'uuid': req.params.uuid, 'owner': harkUser.userID }, (err, result_two) ->
        
        if result_two isnt null
          res.status(500)
          req.session.messages = 'You are already subscribed to that feed.'
          res.render 'layout/modal',
            messages : req.session.messages
          return

        else
          to_insert =
            owner  : harkUser.userID
            _id    : new ObjectID()
            pods   : []
            uuid   : result.uuid
            source : 'directory'
            title  : result.title
            href   : result.href
            description : result.description

          for podcast in result.pods
            to_add =
              podUUID  : podcast.podUUID
              listened : 'true'
            to_insert.pods.push to_add

          to_insert.pods[0].listened = 'false'

          Feeds.insert to_insert, {safe:true}, (err, result) ->
            if (err)
              throw err
            res.send('Success.')

          Directory.findAndModify { 'uuid' : req.params.uuid }, {}, {$inc : { 'subscriptions' : 1 }}, {}, (err, result) ->
            if (err)
              throw err
