module.exports = function(app, express, loadUser, Users, Feeds, db, bcrypt){

//  users.js
// 
//  This file handles all the routing for functions relating to user accounts.
//
//  Order of functions:
//    * Account creation
//    * Lost/reset password (pending)
//    * Password change via settings (pending)
//    * Account deletion

  //  ---------------------------------------
  //  ACCOUNT CREATION
  //  ---------------------------------------

  app.post('/users/new', function(req, res) {
    
    var email = req.param('email'),
      username = req.param('username'),
      password = req.param('password'),
      validate = req.param('password-validate');

    // First off, we need to query the database to see if there's a match for either the e-mail or the username.
    Users.findOne( { $or : [ { 'username': username }, { 'email': email } ] }, function(err, result) {
      if ( result === null ) { // All of this only happens if the database query finds no match for
                   // either the e-mail or the username.
        if ( password !== validate ) { // Ensuring that the passwords match.
          req.flash('errorCreatePass', "The passwords you entered didn't match.");
          res.render('index', {locals: {flash: req.flash()}});
        } else if ( password.length < 6 ) { // Enforcing a minimum password length.
          req.flash('errorCreatePass', "Please use a password that's at least 6 characters.");
          res.render('index', {locals: {flash: req.flash()}});
        } else {
          bcrypt.genSalt(10, 64, function(err, salt) {      // Create a salt,
            bcrypt.hash(password, salt, function(err, hash) { // and then use to hash the password.

              var userData = function(err, data) { // Creating an object for inserting the user's data.
                data.insert({
                  email     : email,
                  username  : username,
                  password  : hash,
                  salt    : salt
                });
              }

              db.collection('Users', userData); // Add that data. Welcome, new user!
              req.flash('userCreateSuccess', "Thanks for registering! You can log in now.");
              res.render('index', {locals: {flash: req.flash()}});
              // res.redirect('/'); // Finally, bring the user back to the index to they can log in.
            });
          });
        }
      } else { // These are only fired *if* the database query comes back with a match for either
           // the e-mail or the password.
        if ( email === result.email ) { // Checking to see if the e-mail is already in use.
          req.flash('errorCreateEmail', "That e-mail address has already been used to register an account.");
          res.render('index', {locals: {flash: req.flash()}});
        } else if ( username === result.username ) { // Checking to see if the username is already in use.
          req.flash('errorCreateUsername', "That username is already in use.");
          res.render('index', {locals: {flash: req.flash()}});
        } else { // Trying to catch any other error that might occur. Hopefully this never happens.
          req.flash('errorCreate', "Sorry, something went wrong.");
          res.render('index', {locals: {flash: req.flash()}});
        }
      }
    });
  });

  //  ---------------------------------------
  //  ACCOUNT DELETION
  //  ---------------------------------------

  app.post('/settings/delete', loadUser, function(req, res) {
    Users.findOne({ $or : [ { 'username': req.session.userID }, { 'email': req.session.userID } ] }, function(err, result) {
      Users.remove({ $or : [ { 'username': req.session.userID }, { 'email': req.session.userID } ] });
      Feeds.remove({ $or : [ { 'owner': result['email'] }, { 'owner': result['username'] } ] });
      req.session.destroy(function() { res.redirect('/login'); });
    });
  });

};