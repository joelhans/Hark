module.exports = function(app, express, loadUser, Users, Feeds, db, bcrypt, nodemailer){

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
          req.flash('createError', "Please use a password that's at least 6 characters.");
          res.render('signup', {locals: {flash: req.flash()}});
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
              req.flash('createSuccess', "Thanks for registering! You can log in now.");
              res.render('login', {locals: {flash: req.flash()}});
            });
          });
        }
      } else {  // These are only fired *if* the database query comes back with a match for either
                // the e-mail or the password.
        if ( req.param('email') === result.email || req.param('email') === result.userID ) { // Checking to see if the e-mail is already in use.
          req.flash('createError', "That e-mail address has already been used to register an account.");
          res.render('signup', {locals: {flash: req.flash()}});
        } else { // Trying to catch any other error that might occur. Hopefully this never happens.
          req.flash('createError', "Sorry, something went wrong.");
          res.render('signup', {locals: {flash: req.flash()}});
        }
      }
    });
  });

  //  ---------------------------------------
  //  FORGOTTEN PASSWORD
  //  ---------------------------------------
  
  app.post('/login/forgot', function(req, res) {
    var salt = Math.round((new Date().valueOf() * Math.random())) + '';
    var resetToken = crypto.createHmac('sha1', salt).update(userEmail).digest('hex');

    Users.findOne({ 'email': req.param('email') }, function(err, result) {

      if ( result === null ) {
        req.flash('errorReset', "An account with that e-mail doesn't exist.");
        res.render('index', {locals: {flash: req.flash()}});
      } else {
        var smtpTransport = nodemailer.createTransport("Sendmail", "/usr/sbin/sendmail"); // I use sendmail. Others may have to find a different solution.

        var mailOptions = { // Creating the email.
          from: "Hark <admin@harkapp.com>",
          to: userEmail,
          subject: "Hark - Password reset.",
          generateTextFromHTML: true,
          html: '<h1>Hark wants to help you reset your password.</h1><p>So, you forgot it. That\'s all right. I\'ll help you get a new one.</p><p>To reset your password, click the link: <a href="http://localhost:3000/login/reset/' + resetToken + '">http://localhost:3000/login/reset/' + resetToken + '</a></p>'
        }
        
        smtpTransport.sendMail(mailOptions, function(error, response){
            if(error) {
                console.log(error);
                res.redirect('/login');
            } else{
                Users.findAndModify({ 'email': userEmail }, [], { $set: { 'resetToken' : resetToken } }, {}, function(err, result) {
              if (err) { throw err; } // If the e-mail sends correctly, we set a token so that the user can make the reset later.
              res.redirect('/login');
            });
            }
            smtpTransport.close();
        });
      }
    });
  });

  app.get('/login/reset/:resetToken', function(req, res) {
    var resetToken = req.param('resetToken');

    Users.find({ 'resetToken': resetToken }).each(function(err, result) {
      if ( result === null ) {
        res.redirect('/login');
      } else {
        res.render('reset', {
          locals: {
            token: resetToken
          }
        });
      }
    });
  });

  app.post('/login/reset/new', function(req, res) {
    var password = req.param('password'),
      validate = req.param('password-validate'),
      resetToken = req.param('resetToken');

    if ( password !== validate ) {
      res.redirect('/login');
    } else {
      bcrypt.genSalt(10, 64, function(err, salt) {
        bcrypt.hash(password, salt, function(err, hash) {
          Users.findAndModify({ 'resetToken': resetToken }, [], { $set: { 'password' : hash, 'salt' : salt }, $unset: { 'resetToken' : resetToken } }, { new:true }, function(err, result) {
            if (err) { throw err; }
            res.redirect('/login');
          });
        });
      });
    }
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