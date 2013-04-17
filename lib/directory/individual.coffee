module.exports = (app, express, loadUser, Directory, Feeds, moment, request, async, parser, ObjectID) ->

  app.get '/directory/podcast/:uuid', loadUser, (req, res) ->
    Directory.findOne { 'uuid' : req.params.uuid }, (err, result) ->
      if err
        res.status(500)
        req.flash 'error', 'Sorry, there was an error.'
        res.partial 'layout/modal', { flash: req.flash() }
        return
      res.render 'directory',
        locals:
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
        req.flash 'error', 'Sorry, there was an error.'
        res.partial 'layout/modal', { flash: req.flash() }
        return
      res.partial 'directory/directory-main',
        locals:
          result     : result
          user       : harkUser
          category   : 'all'
          playing    : harkUser.playing
          individual : true
          page       : false
          final_page : false