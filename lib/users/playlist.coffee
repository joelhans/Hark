module.exports = (app, express, loadUser, Users, Directory, Feeds, db) ->

  #####################################
  # The following functions handle playlist functionality.
  #
  # Progress coming.
  #####################################

  #####################################
  # ADD
  #####################################

  app.post '/listen/playlist/add/', loadUser, (req, res) ->
    Users.findAndModify { 'userID' : harkUser.userID }, [], { $push: { 'playlist' : req.body } }, { new : true , safe : true }, (err, result) ->
      console.log req.body
      if err
        res.status(500)
        req.session.messages = 'Sorry, there was an error.'
        res.render 'layout/modal',
          messages : req.session.messages
        return

      harkUser.playlist = result.playlist
      res.render 'listen/listen-playlist',
        playlist: harkUser.playlist

  #####################################
  # DROP
  #####################################

  app.post '/listen/playlist/drop/', loadUser, (req, res) ->
    Users.findAndModify { 'userID' : harkUser.userID }, [], { $pull: { 'playlist' : { 'podcast' : req.body.podcast } } }, { new : true , safe : true }, (err, result) ->
      if err
        res.status(500)
        req.session.messages = 'Sorry, there was an error.'
        res.render 'layout/modal',
          messages : req.session.messages
        return

      harkUser.playlist = result.playlist
      res.render 'listen/listen-playlist',
        playlist: harkUser.playlist

  #####################################
  # CLEAR
  #####################################

  app.post '/listen/playlist/clear/', loadUser, (req, res) ->
    Users.findAndModify { 'userID' : harkUser.userID }, [], { $set: { 'playlist' : [] } }, { new : true , safe : true }, (err, result) ->
      if err
        res.status(500)
        req.session.messages = 'Sorry, there was an error.'
        res.render 'layout/modal',
          messages : req.session.messages
        return

      harkUser.playlist = []
      res.render 'listen/listen-playlist',
        playlist: harkUser.playlist