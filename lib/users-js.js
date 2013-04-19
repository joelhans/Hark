module.exports = function(app, express, loadUser, Users, Feeds, db, bcrypt, nodemailer, crypto){

//  users.js
// 
//  This file handles all the routing for functions relating to user accounts.
//
//  Order of functions:
//    * Account creation
//    * Lost/reset password
//    * Password change via settings
//    * Account deletion

  //  ---------------------------------------
  //  ACCOUNT CREATION
  //  ---------------------------------------

  app.post('/users/new', function(req, res) {
    // First off, we need to query the database to see if there's a match for either the e-mail or the username.
    Users.findOne({ $or : [ { 'email': req.param('email') }, { 'userID': req.param('email') } ] }, function(err, result) {
      if ( result === null ) {  // All of this only happens if the database query finds no match for
                                // either the e-mail or the username.
        if ( req.param('password').length < 6 ) { // Enforcing a minimum password length.
          req.flash('error', "Please use a password that's at least 6 characters.");
          res.render('signup', { flash: req.flash() });
        } else {
          bcrypt.genSalt(10, 64, function(err, salt) {      // Create a salt,
            bcrypt.hash(req.param('password'), salt, function(err, hash) { // and then use to hash the password.

              var userData = function(err, data) { // Creating an object for inserting the user's data.
                data.insert({
                  userID    : Math.round((new Date().valueOf() * Math.random())) + '',
                  email     : req.param('email'),
                  password  : hash,
                  salt      : salt
                });
              }

              db.collection('Users', userData); // Add that data. Welcome, new user!
              req.flash('success', "Thanks for registering! You can log in now.");
              res.render('login', { flash: req.flash() });
            });
          });
        }
      } else {  // These are only fired *if* the database query comes back with a match for either
                // the e-mail or the password.
        if ( req.param('email') === result.email || req.param('email') === result.userID ) { // Checking to see if the e-mail is already in use.
          req.flash('error', "That e-mail address has already been used to register an account.");
          res.render('signup', { flash: req.flash() });
        } else { // Trying to catch any other error that might occur. Hopefully this never happens.
          req.flash('error', "Sorry, something went wrong.");
          res.render('signup', { flash: req.flash() });
        }
      }
    });
  });

  //  ---------------------------------------
  //  FORGOTTEN PASSWORD
  //  ---------------------------------------
  
  app.post('/login/forgot', function(req, res) {
    var resetToken = Math.round((new Date().valueOf() * Math.random())) + ''

    Users.findOne({ 'email': req.param('email') }, function(err, result) {
      if ( result === null ) {
        req.flash('forgotError', "An account with that e-mail doesn't exist.");
        res.render('forgot', {flash: req.flash()});
      } else {
        var transport = nodemailer.createTransport("sendmail", {
          path: "/usr/sbin/sendmail"
        });

        var mailOptions = { // Creating the email.
          from: "Hark <admin@harkhq.com>",
          to: req.param('email'),
          subject: "Hark - Password reset.",
          generateTextFromHTML: true,
          html: '<h1>Hark wants to help you reset your password.</h1><p>So, you forgot it. That\'s all right. I\'ll help you get a new one.</p><p>To reset your password, click the link: <a href="http://listen.harkhq.com/reset/' + resetToken + '">http://listen.harkhq.com/reset/' + resetToken + '</a></p>'
        }
        
        transport.sendMail(mailOptions, function(error) {
          if (error) {
            req.flash('forgotError', "Error: " + error);
            res.redirect('/forgot', {flash: req.flash()});
          } else {
            Users.findAndModify({ 'email': req.param('email') }, [], { $set: { 'resetToken' : resetToken } }, {}, function(err, result) {
              if (err) { throw err; } // If the e-mail sends correctly, we set a token so that the user can make the reset later.
              req.flash('forgotSuccess', "An e-mail as been sent to you to reset your password. Please click on the link in the e-mail.");
              res.render('forgot', {flash: req.flash()});
            });
          }
          transport.close();
        });
      }
    });
  });

  app.get('/reset/:resetToken', function(req, res) {
    Users.findOne({ 'resetToken': req.param('resetToken') }, function(err, result) {
      if ( result === null ) {
        res.redirect('/');
      } else {
        res.render('reset', {
          locals: {
            token: req.param('resetToken')
          }
        });
      }
    });
  });

  app.post('/reset/new', function(req, res) {
    Users.findOne({ 'email': req.param('email') }, function(err, result) {
      if ( result === null ) {
        req.flash('forgotError', "An account with that e-mail doesn't exist.");
        res.render('reset', {
          locals: {
            flash: req.flash(),
            token: req.param('resetToken')
          }
        });
      } else {
        bcrypt.genSalt(10, 64, function(err, salt) {
          bcrypt.hash(req.param('password'), salt, function(err, hash) {
            Users.findAndModify({ 'resetToken': req.param('resetToken') }, [], { $set: { 'password' : hash, 'salt' : salt }, $unset: { 'resetToken' : req.param('resetToken') } }, { new:true }, function(err, result) {
              if (err) { throw err; }
              req.flash('success', "Your password is reset! You can log in now.");
              res.render('login', {flash: req.flash()});
            });
          });
        });
      }
    });
  });

  //  ---------------------------------------
  //  SETTINGS / CLAIM USERNAME
  //  ---------------------------------------
  app.post('/settings/claim-username', loadUser, function(req, res) {
    Users.findOne({ 'username': req.param('claimed-username') }, function(err, result) {
      if (result === null) {
        Users.findAndModify({ 'userID':  harkUser.userID }, [], { $push: { 'username' : req.param('claimed-username') } }, { new:true, safe:true }, function(err, result) {
          console.log(req.user.username)
        });
      }
    });
  });

  //  ---------------------------------------
  //  SETTINGS / CHANGE PASSWORD
  //  ---------------------------------------

  app.post('/settings/update-password', loadUser, function(req, res) {

    Users.findOne({ 'userID': req.user.userID }, function(err, result) {
      if (err) { throw err; }
      if (result === null) {
        console.log('WTF?');
      } else {
        if ( req.param('password-new') === req.param('password-validate') ) {
          bcrypt.compare(req.param('password-current'), result.password, function(err, result) {
            if (result === true) {
              bcrypt.genSalt(10, 64, function(err, salt) {
                bcrypt.hash(req.param('password-new'), salt, function(err, hash) {
                  Users.findAndModify({ 'userID': req.user.userID }, [], { $set: { 'password' : hash, 'salt' : salt } }, { new:true }, function(err, result) {
                    if (err) { throw err; }
                    res.redirect('/settings');
                  });
                });
              });

            } else {
              req.flash('errorUpdatePassword', "The password you entered did not match your current password.");
              res.render('settings', {
                locals: {
                  username: req.user.username,
                  feeds: [],
                  podcasts: [],
                  playing: req.user.playing,
                  flash: req.flash()
                }
              });
            }
          });
        } else {
          req.flash('errorUpdatePasswordMatch', "The new passwords you entered do not match.");
          res.render('settings', {
            locals: {
              username: req.user.username,
              feeds: [],
              podcasts: [],
              playing: req.user.playing,
              flash: req.flash()
            }
          });
        }
      }
    });
  });

  //  ---------------------------------------
  //  SETTINGS / DELETE ACCOUNT
  //  ---------------------------------------

  app.post('/settings/delete', loadUser, function(req, res) {
    Users.remove({ 'userID': req.user.userID });
    Feeds.remove({ 'owner': req.user.userID });
    req.logOut();
    res.redirect('/');
  });

};