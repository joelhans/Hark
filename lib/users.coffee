module.exports = (app, express, loadUser, Users, Directory, Feeds, db, url, crypto, request, async, xml2js, nodemailer, bcrypt, moment, parser, ObjectID, passport) ->

  #####################################
  # GET FEEDS / PODCASTS
  #####################################

  getFeeds = require('./feeds/get_feeds')(app, express, loadUser, Directory, Feeds, moment, request, async, parser, ObjectID)

  #####################################
  # NEW
  #####################################

  require('./users/new')(app, express, loadUser, Users, Feeds, db, bcrypt, nodemailer, crypto)

  #####################################
  # LOGIN / SIGNUP
  #####################################

  require('./users/login-signup')(app, express, loadUser, passport)

  #####################################
  # ADD SUBSCRIPTION
  #####################################

  require('./feeds/add')(app, express, loadUser, Directory, Feeds, moment, request, async, parser, ObjectID)

  #####################################
  # UPDATE
  #####################################

  require('./feeds/update')(app, express, loadUser, Directory, Feeds, moment, request, async, parser, ObjectID)

  #####################################
  # PLAYLISTS
  #####################################

  require('./users/playlist')(app, express, loadUser, Users, Directory, Feeds, db)

  #####################################
  # LISTEN TO A PODCAST
  ##################################### 

  app.post '/listen/listen/:feed/:id', loadUser, (req, res) ->
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

  app.post '/listen/listened/:feed/:id', loadUser, (req, res) ->
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

  #####################################
  # UNSUBSCRIBE
  #####################################

  app.post '/listen/remove/:id', loadUser, (req, res) ->
    Feeds.findAndModify { 'owner': harkUser.userID, 'uuid': req.body.feedID }, [], {}, { remove:true }, (err, result) ->
      Directory.findAndModify { 'uuid' : req.body.feedID }, {}, {$inc : { 'subscriptions' : -1 }}, {}, (err, result) ->
        if err then throw err

      getFeeds harkUser.userID, 'all', (error, feeds, podcasts) ->
        res.render 'listen/listen-structure',
          user     : harkUser
          feeds    : feeds
          podcasts : podcasts
          playing  : harkUser.playing
          playlist : harkUser.playlist

  #####################################
  # EDIT SUBSCRIPTION
  #####################################

  app.post '/listen/edit/:id', loadUser, (req, res) ->
    Feeds.findAndModify { 'owner': harkUser.userID, 'uuid': req.body.feedID }, [], { $set: { 'title' : req.body.feedName } }, { new:true }, (err, result) ->
      getFeeds harkUser.userID, 'all', (error, feeds, podcasts) ->
        res.render 'listen/listen-structure',
          user     : harkUser
          feeds    : feeds
          podcasts : podcasts
          playing  : harkUser.playing
          playlist : harkUser.playlist

  ####################################
  # IMPORT OPML
  ####################################
  
  require('./opml/import')(app, express, loadUser, Directory, Feeds, moment, request, async, parser, ObjectID)
