//
//  HARK!
//
//  Current version: 2.0.2
//
//  Hark is podcasts for everyone: http://harkhq.com
//  Hark is open source. See it on Github: https://github.com/joelhans/Hark
//


//  ---------------------------------------
//  MODULES
//  ---------------------------------------

var express    = require('express')
  , http       = require('http')
  , url        = require('url')
  , coffee     = require('coffee-script')
  , crypto     = require('crypto')
  , request    = require('request')
  , async      = require('async')
  , xml2js     = require('xml2js')
  , nodemailer = require('nodemailer')
  , bcrypt     = require('bcrypt')
  , moment     = require('moment')
  , mongodb    = require('mongodb')
  , connect    = require('connect')
  , gzippo     = require('gzippo')
  , flash      = require('connect-flash')
  , conf       = require('./lib/conf');

var parser = new xml2js.Parser();

//  ---------------------------------------
//  DATABASES
//  ---------------------------------------

var Db            = require('mongodb').Db
  , Server        = require('mongodb').Server
  , server_config = new Server('localhost', 27017, {safe: true, auto_reconnect: true})
  , db            = new Db('Hark', server_config, {w: 1})
  , mongoStore    = require('connect-mongodb')
  , ObjectID      = require('mongodb').ObjectID;

var Users     = new mongodb.Collection(db, 'Users')
  , Feeds     = new mongodb.Collection(db, 'Feeds')
  , Directory = new mongodb.Collection(db, 'Directory');

//  ---------------------------------------
//  PASSPORT CONFIGURATION
//  ---------------------------------------

var passport         = require('passport')
  , LocalStrategy    = require('passport-local').Strategy;

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

passport.use(new LocalStrategy({
    usernameField: 'email'
  },
  function(username, password, done) {
    Users.findOne({ email: username }, function(err, user) {
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, { message: 'That account doesn\'t exist.' });
      }
      else {
        bcrypt.compare(password, user.password, function(err, result) {
          if (result === true) {
            return done(null, user);
          } else {
            return done(null, false, { message: 'Wrong password.' });
          }
        });
      }
    });
  }
));

//  ---------------------------------------
//  EXPRESS CONFIGURATION
//  ---------------------------------------

var app = express();

app.configure(function() {
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.set("view options", { layout: false });
  app.use(express.cookieParser(conf.session.cookieParser));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.session({
    secret: conf.session.secret
    , store: new mongoStore({db: db})
    , cookie: {  
      path     : '/',  
      httpOnly : true,  
      maxAge   : 1000*60*60*24*30*12    //one year(ish)  
    }
    }
  ));
  app.use(flash());
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(app.router);
  app.use(gzippo.staticGzip(__dirname + '/public'));
});

//  ---------------------------------------
//  HELPERS
//  ---------------------------------------

function loadUser(req, res, next) {
  // This little catch standardizes the way Hark uses session data to allow users to move around in
  // authenticated areas. The "if" statement applies when a new account is created, while the "else"
  // applies any time after the fact. I don't like it, but it works.
  //
  // After setting "harkUser," we let the route continue. If there is no user, we redirect to the
  // login page.

  if (typeof(req.user) !== 'undefined' && req.url !== '/') {
    if (typeof(req.user[0]) !== 'undefined') {
      harkUser = req.user[0];
    } else {
      harkUser = req.user;
    }
    console.log('OUR USER: ' + harkUser.userID);
    return next();
  } else if (typeof(req.user) !== 'undefined' && req.url === '/') {
    res.redirect('/listen');
  } else if ( typeof(req.user) === 'undefined' && req.url === '/' ) {
    return next();
  } else if ( typeof(req.user) === 'undefined' && req.url === '/signup' ) {
    return next();
  } else if ( typeof(req.user) === 'undefined' && req.url === '/login' ) {
    return next();
  } else if ( typeof(req.user) === 'undefined' && req.url.indexOf('/listen') !== -1 ) {
    res.redirect('/login');
  } else if ( typeof(req.user) === 'undefined' && req.url.indexOf('/directory') !== -1 ) {
    harkUser = false;
    return next();
  } else {
    res.redirect('/');
  }
}

require('./lib/routes')(app, express, loadUser, Users, Directory, Feeds, db, url, crypto, request, async, xml2js, nodemailer, bcrypt, moment, parser, ObjectID, passport)
require('./lib/users-js.js')(app, express, loadUser, Users, Directory, Feeds, db, url, crypto, request, async, xml2js, nodemailer, bcrypt, moment, parser, ObjectID, passport)
require('./lib/users')(app, express, loadUser, Users, Directory, Feeds, db, url, crypto, request, async, xml2js, nodemailer, bcrypt, moment, parser, ObjectID, passport)
require('./lib/directory')(app, express, loadUser, Users, Directory, Feeds, db, url, crypto, request, async, xml2js, nodemailer, bcrypt, moment, parser, ObjectID, passport)

// app, express, loadUser, Users, Directory, Feeds, db, crypto, request, async, xml2js, nodemailer, bcrypt, moment, parser, ObjectID, passport

//  ---------------------------------------
//  START THE SERVER!
//  ---------------------------------------

app.listen(3000);
console.log("Express server listening.");
