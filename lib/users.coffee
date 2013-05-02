module.exports = (app, express, loadUser, Users, Directory, Feeds, db, bcrypt, nodemailer, crypto, passport) ->

  #####################################
  # LOGIN / SIGNUP
  #####################################

  require('./users/login-signup')(app, express, loadUser, passport)

  #####################################
  # PLAYLISTS
  #####################################

  require('./users/playlist')(app, express, loadUser, Users, Directory, Feeds, db)

  #####################################
  # LISTEN TO A PODCAST
  ##################################### 

  app.post '/listen/:feed/:_id', loadUser, (req, res) ->
    harkUser.playing = req.body
    Users.findAndModify { 'userID':  harkUser.userID }, [], { $set: { 'playing' : req.body } }, { new:true, safe:true }, (err, result) ->
      if err
        res.status(500)
        req.session.messages = 'Sorry, there was an error.'
        res.render 'layout/modal',
          messages : req.session.messages
        return
      res.send(200)

  #####################################
  # MARK A PODCAST AS "LISTENED"
  ##################################### 

  app.post '/listen/:feed/listened/:id', loadUser, (req, res) ->
    harkUser.playing = {}
    Feeds.findAndModify { 'owner': harkUser.userID, 'pods.podUUID' : req.params.id }, [], { $set: { 'pods.$.listened' : 'true' } }, { new:true }, (err, result) ->
      if err
        res.status(500)
        req.session.messages = 'Sorry, there was an error.'
        res.render 'layout/modal',
          messages : req.session.messages
        return
      res.send(200)

  #####################################
  # SYNC
  ##################################### 

  app.post '/listen/playing', loadUser, (req, res) ->
    harkUser.playing = req.body
    Users.findAndModify { 'userID':  harkUser.userID }, [], { $set: { 'playing' : req.body } }, { new:true }, (err, result) ->
      if err
        res.status(500)
        req.session.messages = 'Sorry, there was an error.'
        res.render 'layout/modal',
          messages : req.session.messages
        return
      res.send(200)
