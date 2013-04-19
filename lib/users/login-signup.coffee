module.exports = (app, express, loadUser) ->  

  passport = require 'passport'

  #####################################
  # HOME / INTRO
  #####################################

  app.get '/', loadUser, (req, res) ->
     res.render 'home'

  #####################################
  # SIGNUP
  #####################################

  app.get '/signup', loadUser, (req, res) ->
     res.render 'signup'

  #####################################
  # LOGIN
  #####################################

  app.get '/login', loadUser, (req, res) ->
     res.render 'login', { message: req.flash('error') }

  #####################################
  # LOGIN via POST
  #####################################

  app.post '/login', 
    passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }), 
    (req, res) ->
      res.redirect '/listen'

  #####################################
  # FORGOTTEN PASSWORD
  #####################################

  app.get '/forgot', (req, res) ->
     res.render 'forgot'

  #####################################
  # LOGOUT
  #####################################

  app.get '/logout', (req, res) ->
    req.logOut()
    res.redirect '/login'