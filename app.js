//
//  HARK!
//
//  Current version: 0.6.0
//
//  Hark is your personal radio station. Podcasts. Radio. Revolutionized.
//  Hark is open source. See it on Github: https://github.com/joelhans/Hark
//
//  Table of contents:
//    * Modules
//    * Databases
//    * Express
//    * Helpers
//    * And so on...


//  ---------------------------------------
//  MODULES
//  ---------------------------------------

var express = require('express')
  , http = require('http')
  , url = require('url')
  , crypto = require('crypto')
  , request = require('request')
  , async = require('async')
  , xml2js = require('xml2js')
  , nodemailer = require('nodemailer')
  , bcrypt = require('bcrypt')
  , moment = require('moment')
  , mongodb = require('mongodb')
  , conf = require('./conf')
  , connect = require('connect');

var parser = new xml2js.Parser();

//  ---------------------------------------
//  DATABASES
//  ---------------------------------------

var Db = require('mongodb').Db
  , Server = require('mongodb').Server
  , server_config = new Server('localhost', 27017, {auto_reconnect: true, native_parser: true})
  , db = new Db('Hark', server_config, {})
  , mongoStore = require('connect-mongodb')
  , ObjectID = require('mongodb').ObjectID;

var Users = new mongodb.Collection(db, 'Users')
  , Feeds = new mongodb.Collection(db, 'Feeds');

//  ---------------------------------------
//  PASSPORT CONFIGURATION
//  ---------------------------------------

var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy
  , TwitterStrategy = require('passport-twitter').Strategy
  , FacebookStrategy = require('passport-facebook').Strategy
  , GoogleStrategy = require('passport-google').Strategy;

passport.serializeUser(function(user, done) {
  console.log(user['_id']);
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  console.log(obj);
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

passport.use(new TwitterStrategy({
    consumerKey: conf.twitter.consumerKey,
    consumerSecret: conf.twitter.consumerSecret,
    callbackURL: "http://listen.harkhq.com.com:3000/auth/twitter/callback"
  },
  function(token, tokenSecret, profile, done) {
    Users.findOne({ 'userID': profile.id }, function(err, user) {
      if (err) { return done(err); }
      if (!user) {
        var twitterUser = {
          userID     : profile.id,
          username   : profile.displayName
        }
        Users.insert(twitterUser, {safe:true}, function(err, newUser) {
          return done(null, newUser);
        });
      }
      else {
        return done(null, user);
      }
    });
  }
));

passport.use(new FacebookStrategy({
    clientID: conf.facebook.appId,
    clientSecret: conf.facebook.appSecret,
    callbackURL: "http://listen.harkhq.com.com:3000/auth/facebook/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    Users.findOne({ 'userID': profile.id }, function(err, user) {
      if (err) { return done(err); }
      if (!user) {
        var facebookUser = {
          userID     : profile.id,
          username   : profile.displayName
        };
        Users.insert(facebookUser, {safe:true}, function(err, newUser) {
          return done(null, newUser);
        });
      }
      else {
        return done(null, user);
      }
    });
  }
));

passport.use(new GoogleStrategy({
    returnURL: 'http://listen.harkhq.com:3000/auth/google/return',
    realm: 'http://*.harkhq.com'
  },
  function(identifier, profile, done) {
    Users.findOne({ 'userID': profile.id }, function(err, user) {
      if (err) { return done(err); }
      if (!user) {
        var googleUser = {
          userID     : profile.emails[0].value,
          username   : profile.displayName
        };
        Users.insert(googleUser, {safe:true}, function(err, newUser) {
          return done(null, newUser);
        });
      }
      else {
        return done(null, user);
      }
    });
  }
));

//  ---------------------------------------
//  EXPRESS CONFIGURATION
//  ---------------------------------------

var app = module.exports = express.createServer();

app.configure(function() {
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.set("view options", { layout: false });
  // app.use(express.logger());
  app.use(express.cookieParser());
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
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
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

  if (typeof(req.user) !== 'undefined') {
    if (typeof(req.user[0]) !== 'undefined') {
      harkUser = req.user[0];
    } else {
      harkUser = req.user;
    }
    return next();
  } else if ( typeof(req.user) === 'undefined' && req.url === '/signup' ) {
    return next();
  } else if ( typeof(req.user) === 'undefined' && req.url === '/' ) {
    return next();
  }
  res.redirect('/');
}

require('./users.js')(app, express, loadUser, Users, Feeds, db, bcrypt, nodemailer);
require('./feeds.js')(app, express, loadUser, Users, Feeds, db);
require('./directory.js')(app, express, loadUser, Users, Feeds);

//  ---------------------------------------
//  ROUTES
//  ---------------------------------------

app.get('/', loadUser, function(req, res) {
  res.render('login', { message: req.flash('error') });
});

app.get('/signup', loadUser, function(req, res) {
  res.render('signup');
});

app.post('/login', 
  passport.authenticate('local', { failureRedirect: '/', failureFlash: true }),
  function(req, res) {
    res.redirect('/listen');
  });

app.get('/auth/twitter', passport.authenticate('twitter'));

app.get('/auth/twitter/callback', 
  passport.authenticate('twitter', { failureRedirect: '/', failureFlash: true }),
  function(req, res) {
    res.redirect('/listen');
  });

app.get('/auth/facebook', passport.authenticate('facebook'));

app.get('/auth/facebook/callback', 
  passport.authenticate('facebook', { failureRedirect: '/', failureFlash: true }),
  function(req, res) {
    res.redirect('/listen');
  });

app.get('/auth/google', passport.authenticate('google'));

app.get('/auth/google/return', 
  passport.authenticate('google', { failureRedirect: '/', failureFlash: true }),
  function(req, res) {
    res.redirect('/listen');
  });

app.get('/forgot', function(req, res) {
  res.render('forgot');
});

//
//  LOGOUT
//

app.get('/logout', function(req, res){
  req.logOut();
  res.redirect('/');
});

//
//  THE DEFAULT VIEW
//

app.get('/listen', loadUser, function(req, res) {
  getFeeds(harkUser.userID, function(error, feed, podcastList) {
    res.render('listen', {
      locals: {
        username: harkUser.username,
        feeds: feed,
        podcasts: podcastList,
        playing: harkUser.playing
      }
    });
  });
});

//
// THE DEFAULT VIA AJAX/HTML5 HISTORY
//

app.post('/listen', loadUser, function(req, res) {
  getFeeds(harkUser.userID, function(error, feed, podcastList) {
    res.partial('partials/podcasts', { feeds: feed, podcasts: podcastList });
  });
});

//
//  VIEW THE FULL LISTIING OF ONLY A SINGLE PODCAST
//

app.post('/listen/podcast/:_id', loadUser, function(req, res) {
  Feeds.find({ 'owner': harkUser.userID, uuid: req.param('feed') }).toArray(function(err, results) {
    var feed = new Array(),
      podcastList = new Array();

    feed = {
      feedTitle     : results[0].title,
      feedDescription : results[0].description,
      feeduuid    : results[0].uuid
    }

    for ( var i = 0; i < results[0].pods.length; ++i) {
      var podData = results[0].pods[i];

      podData['feedTitle'] = results[0].title;
      podData['feedUUID'] = results[0].uuid;

      podcastList.push(podData);
    }

    if (typeof podcastList[0].podTitle == "undefined") {
      return;
    } else {
      podcastList.sort(function (a , b) {
        if (a['podDate']['_d'] > b['podDate']['_d'])
          return -1;
        if (a['podDate']['_d'] < b['podDate']['_d'])
          return 1;
        return 0;
      });
    }

    res.partial('partials/single', { feeds: feed, podcasts: podcastList });
  });
});

//
//  VIEW THE FULL LISTIING OF ONLY A SINGLE PODCAST, THIS TIME VIA DEEP-LINKING OR BOOKMARK
//

app.get('/listen/podcast/:id', loadUser, function(req, res) {

  var podcastList = new Array(),
    construction = new Array();

  async.waterfall([
    function ( callback ) {
      Feeds.find({ 'owner': harkUser.userID, uuid: req.params.id }).toArray(function(err, results) {
        // NOT NECESSARY?
        var feed = new Array();

        feed = {
          feedTitle     : results[0].title,
          feedDescription : results[0].description,
          feeduuid    : results[0].uuid
        }

        for ( var i = 0; i < results[0].pods.length; ++i) {
          var podData = results[0].pods[i];

          podData['feedTitle'] = results[0].title;
          podData['feedUUID'] = results[0].uuid;

          podcastList.push(podData);
        }

        if (typeof podcastList[0].podTitle == "undefined") {
          return;
        } else {
          podcastList.sort(function (a , b) {
            if (a['podDate']['_d'] > b['podDate']['_d'])
              return -1;
            if (a['podDate']['_d'] < b['podDate']['_d'])
              return 1;
            return 0;
          });
        }

        callback( null, podcastList );
      });
    },
    function ( podcastList, callback ) {
      Feeds.find({ 'owner': harkUser.userID }).toArray(function(err, results) {
        for (var i = 0; i < results.length; ++i) {
          data = {
            feedTitle     : results[i].title,
            feedDescription : results[i].description,
            feeduuid    : results[i].uuid
          }
          construction.push(data);
        }

        construction.sort(function (a , b) {
          if (a['feedTitle'].toLowerCase() > b['feedTitle'].toLowerCase())
            return 1;
          if (a['feedTitle'].toLowerCase() < b['feedTitle'].toLowerCase())
            return -1;
          return 0;
        });

        callback( null, podcastList, construction );
      });
    }
  ], function () {
    res.render('listen', {
      locals: {
        username: req.user.username,
        feeds: construction,
        podcasts: podcastList,
        playing: req.user.playing
      }
    });
  });
});

//
//  LISTEN TO A PODCAST
//

app.post('/listen/:feed/:_id', loadUser, function(req, res) {
  Feeds.find({ 'owner': harkUser.userID, 'uuid': req.param('feedUUID'), 'pods.podUUID': req.param('podcastID') }).toArray(function(err, results) {
    for (var i = 0; i < results[0].pods.length; ++i) {
      if ( results[0].pods[i].podUUID === req.param('podcastID') ) { 
        var podData = results[0].pods[i];
        podData['feedTitle'] = results[0].title;
        podData['feedUUID'] = results[0].uuid;
        res.partial('partials/player-playing', { playing: podData });
      }
    }
  });
});

//
//  MARK A PODCAST AS "LISTENED"
//

app.post('/listen/:feed/listened/:_id', loadUser, function(req, res) {
  harkUser.playing = {};
  Feeds.findAndModify({ 'owner': harkUser.userID, 'pods.podUUID' : req.param('podcastID') }, [], { $set: { 'pods.$.listened' : 'true' } }, { new:true }, function(err, result) {
    if(err) { throw err; }
      res.send(result);
  });
});

//
//  SYNC
//

app.post('/listen/playing', loadUser, function(req, res) {
  harkUser.playing = req.body;
  Users.findAndModify({ 'userID':  harkUser.userID }, [], { $set: { 'playing' : req.body } }, { new:true }, function(err, result) {
    res.send(result);
  });
});

//
//  SETTINGS
//

app.post('/settings', loadUser, function(req, res) {
  res.partial('partials/settings');
});

//
//  SETTINGS VIA DEEP-LINKING/RELOAD
//

app.get('/settings', loadUser, function(req, res) {
  res.render('settings', {
    locals: {
      username: harkUser.username,
      feeds: [],
      podcasts: [],
      playing: harkUser.playing
    }
  });
});

//
//  HELP -- DISABLED FOR FUTURE RELEASE
//

// app.post('/help', loadUser, function(req, res) {
//   res.partial('partials/help');
// });

//
//  HELP VIA DEEP-LINKING/RELOAD
//

// app.get('/help', loadUser, function(req, res) {
//   res.render('help', {
//     locals: {
//       username: harkUser.username,
//       feeds: [],
//       podcasts: [],
//       playing: harkUser.playing
//     }
//   });
// });

//
//  404
//

app.use(function(req, res){
  res.render('404');
});

//  ---------------------------------------
//  START THE SERVER!
//  ---------------------------------------

app.listen(3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);