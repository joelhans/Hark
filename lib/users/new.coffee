module.exports = (app, express, loadUser, Users, Feeds, db, bcrypt, nodemailer, crypto) ->

  app.post '/users/new', (req, res) ->

    Users.findOne { $or : [ { 'email': req.param('email') }, { 'userID': req.param('email') } ] }, (err, result) ->

      # This fires if the entered username is free.
      if result is null
        # Ensure the password is more than six characters.
        if req.param('password').length < 6
          req.flash 'error', 'Please use a password that is at least 6 characters.'
          res.render 'signup', 
            message: req.flash('error')
        # If it's more than six characters...
        else
          bcrypt.genSalt 10, 64, (err, salt) ->
            bcrypt.hash req.param('password'), salt, (err, hash) ->

              # This function contains our user's data and will be inserted into the database.
              userData =
                userID    : Math.round((new Date().valueOf() * Math.random())) + ''
                email     : req.param('email')
                password  : hash
                salt      : salt

              # Insert and redirect to the login page.
              Users.insert userData, {safe: true}, (err, result) ->
                req.flash 'success', 'Thanks for registering! You can log in now.'
                res.render 'login',
                  message: req.flash('success')

      # This fires if there is already a user with that username.
      else
        req.flash 'error', 'Either that username is in use already, or another error occurred. Try again with something new.'
        res.render 'signup',
          message: req.flash('error')