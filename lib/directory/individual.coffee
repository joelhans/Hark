module.exports = (app, express, loadUser, Directory, Feeds, moment, request, async, parser, ObjectID) ->

  app.get '/directory/podcast/:uuid', loadUser, (req, res) ->
    Directory.findOne { 'uuid' : req.params.uuid }, (err, result) ->
      if err
        res.status(500)
        req.session.messages = 'Sorry, there was an error.'
        res.render 'layout/modal',
          messages : req.session.messages
        return
      res.render 'directory',
        result     : result
        user       : harkUser
        category   : 'all'
        playing    : harkUser.playing
        individual : true
        page       : false
        final_page : false

  app.post '/directory/podcast/:uuid', loadUser, (req, res) ->
    Directory.findOne { 'uuid' : req.params.uuid }, (err, result) ->
      if err
        res.status(500)
        req.session.messages = 'Sorry, there was an error.'
        res.render 'layout/modal',
          messages : req.session.messages
        return
      res.render 'directory/directory-main',
        result     : result
        user       : harkUser
        category   : 'all'
        playing    : harkUser.playing
        individual : true
        page       : false
        final_page : false