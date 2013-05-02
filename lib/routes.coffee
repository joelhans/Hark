module.exports = (app, express, loadUser, Users, Feeds, Directory, db, moment, ObjectID) ->

  #####################################
  # LISTEN
  #####################################

  app.get '/listen', loadUser, (req, res) ->
    getFeeds harkUser.userID, 'all', (error, feeds, podcasts) ->
      res.render 'listen',
        user     : harkUser
        feeds    : feeds
        podcasts : podcasts
        playing  : harkUser.playing
        playlist : harkUser.playlist

  #####################################
  # LISTEN, via AJAX
  #####################################

  app.post '/listen', loadUser, (req, res) ->
    getFeeds harkUser.userID, 'all', (error, feeds, podcasts) ->
      res.render 'listen/listen-structure',
        user     : harkUser
        feeds    : feeds
        podcasts : podcasts
        playing  : harkUser.playing
        playlist : harkUser.playlist

  #####################################
  # LISTEN, via 'all' button
  #####################################

  app.post '/listen/podcast/all', loadUser, (req, res) ->
    getFeeds harkUser.userID, 'all', (error, feeds, podcasts) ->
      res.render 'listen/listen-main',
        user     : harkUser
        feeds    : feeds
        podcasts : podcasts
        playing  : harkUser.playing
        playlist : harkUser.playlist

  #####################################
  # LISTEN, single view
  #####################################

  app.get '/listen/view/:id', loadUser, (req, res) ->
    getFeeds harkUser.userID, req.params.id, (error, feed, podcasts) ->
      res.render 'listen',
        single   : true
        user     : harkUser
        feeds    : feed
        podcasts : podcasts
        playing  : harkUser.playing
        playlist : harkUser.playlist

  #####################################
  # LISTEN, single view, via AJAX
  #####################################

  app.post '/listen/view/:id', loadUser, (req, res) ->
    getFeeds harkUser.userID, req.params.id, (error, feed, podcasts) ->
      res.render 'listen/listen-single',
        user     : harkUser
        feeds    : feed
        podcasts : podcasts
        playing  : harkUser.playing
        playlist : harkUser.playlist

  #####################################
  # SETTINGS
  #####################################

  app.get '/settings', loadUser, (req, res) ->
    res.render 'settings',
      user     : harkUser
      feeds    : []
      podcasts : []
      playing  : harkUser.playing

  #####################################
  # SETTINGS, via AJAX
  #####################################

  app.post '/settings', loadUser, (req, res) ->
    res.render 'settings/settings-structure',
      user    : harkUser
      playing : harkUser.playing

  #####################################
  # HELP
  #####################################

  app.get '/help', loadUser, (req, res) ->
    res.partial 'help',
      user     : harkUser
      feeds    : []
      podcasts : []
      playing  : harkUser.playing

  #####################################
  # HELP, via AJAX
  #####################################

  app.post '/help', loadUser, (req, res) ->
    res.render 'help/help-structure',
      user    : harkUser
      playing : harkUser.playing

  #####################################
  # RSS
  #####################################

  app.get '/user/:user/rss', (req, res) ->
    getFeeds req.params.user, (error, feed, podcastList) ->
      res.render 'rss',
        podcasts: podcastList

  #####################################
  # 404
  #####################################

  app.use (req, res) ->
    res.render '404'
