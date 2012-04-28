//
//	HARK!
//
//	Current version: 0.0.1
//
//	Hark is your personal radio station. Podcasts. Radio. Revolutionized.
//	Hark is open source. See it on Github: https://github.com/joelhans/Hark
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
  , connect = require('connect')
  , http = require('http')
  , url = require('url')
  , crypto = require('crypto')
  , request = require('request')
  , async = require('async')
  , xml2js = require('xml2js')
  , nodemailer = require('nodemailer')
  , bcrypt = require('bcrypt')
  , moment = require('moment')
  , mongodb = require('mongodb');
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
//	EXPRESS CONFIGURATION
//  ---------------------------------------

var app = module.exports = express.createServer();

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.set("view options", { layout: false });
  app.use(express.bodyParser());
  app.use(express.cookieParser());
  app.use(express.session({
      maxAge: new Date(Date.now() + 3600000)
    , secret: 'this is a big secret!!!'
    , store: new mongoStore({db: db})
    })
  );
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  var oneYear = 31557600000;
  app.use(express.errorHandler());
  app.use(express.static(__dirname + '/public', { maxAge: oneYear }));
});

process.on('uncaughtException', function (error) {
   console.log('TIME: ' + moment().format('dddd, MMMM Do YYYY, h:mm:ss a') + ' ERROR: ' + error.stack);
});

//  ---------------------------------------
//  HELPERS
//  ---------------------------------------

function loadUser(req, res, next) {
  if (req.session.userID) {
    Users.findOne({ $or : [ { 'username': req.session.userID }, { 'email': req.session.userID } ] }, function(err, result) {
      if (result) {
        next();
      } else {
        res.redirect('/login');
      }
    });
  } else {
    res.redirect('/login');
  }
}

require('./users.js')(app, express, loadUser, Users, Feeds, db, bcrypt);
require('./feeds.js')(app, express, loadUser, Users, Feeds);

//  ---------------------------------------
//  ROUTES
//  ---------------------------------------

app.get('/', loadUser, function(req, res) {
  res.redirect('/login'); // Let's just redirect ourselves to the login page.
});

app.get('/login', function(req, res) {
  res.render('index'); // Where we render the index template. Makes sense, right?
});

app.post('/login', function(req, res) { 
  Users.findOne({ $or : [ { 'username': req.body.username }, { 'email': req.body.username } ] }, function(err, result) {

    if ( result === null ) { // No user found.
      req.flash('errorUser', "That user doesn't exist.");
      res.render('index', {locals: {flash: req.flash()}});
    } else { // User found.
      bcrypt.compare(req.param('password'), result.password, function(err, result) {
        if (result === true) {
          req.session.userID = req.body.username;
          res.redirect('/listen');
        } else {
          req.flash('errorPass', "Incorrect password. Try again.");
          res.render('index', {locals: {flash: req.flash(), errorType: 'login'}});
        }
      });
    }
  });
});

app.post('/login/forgot', function(req, res) {
	var userEmail = req.param('email')
		, salt = Math.round((new Date().valueOf() * Math.random())) + '';
	var resetToken = crypto.createHmac('sha1', salt).update(userEmail).digest('hex');

	Users.findOne({ 'email': userEmail }, function(err, result) {

		if ( result === null ) {
			req.flash('errorReset', "An account with that e-mail doesn't exist.");
			res.render('index', {locals: {flash: req.flash()}});
		} else {
			var smtpTransport = nodemailer.createTransport("Sendmail", "/usr/sbin/sendmail"); // I use sendmail. Others may have to find a different solution.

			var mailOptions = { // Creating the email.
				from: "Hark! <admin@harkapp.com>",
				to: userEmail,
				subject: "Hark! - Password reset.",
				generateTextFromHTML: true,
				html: '<h1>Hark! wants to help you reset your password.</h1><p>So, you forgot it. That\'s all right. I\'ll help you get a new one.</p><p>To reset your password, click the link: <a href="http://localhost:3000/login/reset/' + resetToken + '">http://localhost:3000/login/reset/' + resetToken + '</a></p>'
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
		console.log(result);
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



app.get('/logout', function(req, res) {
	if (req.session) { req.session.destroy(function() {}); } // Destroy the session so that they have to login again.
	res.redirect('/login'); // And then redirect them to the login.
})

//
// THE DEFAULT VIEW
//

app.get('/listen', loadUser, function(req, res) {
	Users.findOne({ $or : [ { 'username': req.session.userID }, { 'email': req.session.userID } ] }, function(err, result) {
		getFeeds(result['email'], result['username'], function(error, feed, podcastList) {
			res.render('listen', {
				locals: {
					username: result['username'],
					feeds: feed,
					podcasts: podcastList,
					playing: result['playing']
				}
			});
		});
	});
});

//
// THE DEFAULT VIA AJAX/HTML5 HISTORY
//

app.post('/listen', loadUser, function(req, res) {
	Users.findOne({ $or : [ { 'username': req.session.userID }, { 'email': req.session.userID } ] }, function(err, result) {
		getFeeds(result['email'], result['username'], function(error, feed, podcastList) {
			res.partial('partials/podcasts', { feeds: feed, podcasts: podcastList });
		});
	});
});



//
// ADD A PODCAST SUBSCRIPTION
//

app.post('/listen/add', loadUser, function(req, res) {

	var feedURL = req.body.url;

	Feeds.findOne({ 'href': feedURL }, function(err, result) {
		if ( result !== null ) {
			req.flash('errorAddFeed', "You already added that feed!");
			Users.findOne({ $or : [ { 'username': req.session.userID }, { 'email': req.session.userID } ] }, function(err, result) {
				getFeeds(result['email'], result['username'], function(error, feeds, podcastList) {
					res.partial('partials/podcasts', { feeds: feeds, podcasts: podcastList, flash: req.flash() });		
				});
			});
			return;
		} else {
			request({uri: feedURL}, function(error, response, body){

				if ( error ) {
					req.flash('errorAddFeed', "An error occured.");
					Users.findOne({ $or : [ { 'username': req.session.userID }, { 'email': req.session.userID } ] }, function(err, result) {
						getFeeds(result['email'], result['username'], function(error, feeds, podcastList) {
							res.partial('partials/podcasts', { feeds: feeds, podcasts: podcastList, flash: req.flash() });		
						});
					});
					return;
				}

				//
				// http://feeds.thisamericanlife.org/talpodcast
				//

				parser.parseString(body, function (err, result) {

					if (typeof result == "undefined") {
						req.flash('errorAddFeed', "An error occured when adding that feed. Check the URL and try again.");
						Users.findOne({ $or : [ { 'username': req.session.userID }, { 'email': req.session.userID } ] }, function(err, result) {
							getFeeds(result['email'], result['username'], function(error, feeds, podcastList) {
								res.partial('partials/podcasts', { feeds: feeds, podcasts: podcastList, flash: req.flash() });		
							});
						});
					}

					var feed = result.channel,
						i,
						mediaType,
						pubDate,
						listened,
						construction = new Array(),
						podData = new Array();

					for ( i = 0; i < 10; ++i ) {
						podData = {};

						// console.log('ITEM: ' + feed.item.title);
						// console.log('FEED TITLE: ' + feed.item[i].title);
						
						if ( typeof feed.item[i] !== "undefined" ) {
							if ( typeof feed.item[i].enclosure !== "undefined" ) {

								if ( typeof feed.item[i]['pubDate'] == "string" ) {
									pubDate = moment(feed.item[i]['pubDate'], "dd\, DD MMM YYYY H:mm:ss Z")
								} else if ( typeof feed.item[i]['dc:date'] == "string" ) {
									pubDate = moment(feed.item[i]['dc:date'], "YYYY-MM-DD\TH:mm:ssZ");
								}

								if ( i === 0 ) {
									listened = 'false';
								} else {
									listened = 'true';
								}

								podData = {
									'podTitle'	: feed.item[i].title,
									'podLink'	: feed.item[i].link,
									'podFile'	: feed.item[i].enclosure['@'].url,
									'podMedia'	: feed.item[i].media,
									'podDesc'	: feed.item[i].description,
									'podUUID'	: Math.round((new Date().valueOf() * Math.random())) + '',
									'podDate'	: pubDate,
									'prettyDay' : pubDate.format('D'),
									'prettyMonth' : pubDate.format('MMMM'),
									'prettyYear' : pubDate.format('YYYY'),
									'listened'	: listened
								};
								construction.push(podData);
							}
						} else if ( typeof feed.item.title !== "undefined" ) {

							if ( typeof feed.item['pubDate'] == "string" ) {
								pubDate = moment(feed.item['pubDate'], "dd\, DD MMM YYYY H:mm:ss Z")
							} else if ( typeof feed.item['dc:date'] == "string" ) {
								pubDate = moment(feed.item['dc:date'], "YYYY-MM-DD\TH:mm:ssZ");
							}
							
							listened = 'false';

							podData = {
									'podTitle'	: feed.item.title,
									'podLink'	: feed.item.link,
									'podFile'	: feed.item.enclosure['@'].url,
									'podMedia'	: feed.item.media,
									'podDesc'	: feed.item.description,
									'podUUID'	: Math.round((new Date().valueOf() * Math.random())) + '',
									'podDate'	: 'pubDate',
									'prettyDay' : pubDate.format('D'),
									'prettyMonth' : pubDate.format('MMMM'),
									'prettyYear' : pubDate.format('YYYY'),
									'listened'	: 'false'
								};
							construction.push(podData);
							break;
						} else if ( typeof feed.item[i] === "undefined" ) {
							break;
						}
					}

					var feedData = function(err, data) {
						data.insert({
							title 			: feed.title,
							href			: feedURL,
							description 	: feed.description,
							pods 			: construction,
							uuid			: Math.round((new Date().valueOf() * Math.random())) + '',
							owner			: req.session.userID
						});
					}

					db.collection('Feeds', feedData);

					Users.findOne({ $or : [ { 'username': req.session.userID }, { 'email': req.session.userID } ] }, function(err, result) {
						getFeeds(result['email'], result['username'], function(error, feeds, podcastList) {
							res.partial('partials/podcasts', { feeds: feeds, podcasts: podcastList });			
						});
					});
				});
			});
		}
	});
});

//
//	REMOVE A PODCAST SUBSCRIPTION
//

app.post('/listen/remove/:_id', loadUser, function(req, res) {
	
	var uuid = req.param('id');

	Feeds.findAndModify({ $or : [ { 'owner': req.session.userID }, { 'owner': req.session.userID } ], uuid: uuid }, [], {}, { remove:true }, function(err, result) {
		Users.findOne({ $or : [ { 'username': req.session.userID }, { 'email': req.session.userID } ] }, function(err, result) {
			getFeeds(result['email'], result['username'], function(error, feeds, podcastList) {
				res.partial('partials/podcasts', { feeds: feeds, podcasts: podcastList });
			});
		});
	});
});

//
//	VIEW THE FULL LISTIING OF ONLY A SINGLE PODCAST
//

app.post('/listen/podcast/:_id' ,loadUser, function(req, res) {

	Users.findOne({ $or : [ { 'username': req.session.userID }, { 'email': req.session.userID } ] }, function(err, result) {
		Feeds.find( { $or : [ { 'owner': result['email'] }, { 'owner': result['username'] } ], uuid: req.param('feed') }).toArray(function(err, results) {
			var feed = new Array(),
				podcastList = new Array();

			feed = {
				feedTitle 		: results[0].title,
				feedDescription : results[0].description,
				feeduuid		: results[0].uuid
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

			res.partial('partials/single', { feed: feed, podcasts: podcastList });
		});
	});
});

//
//	VIEW THE FULL LISTIING OF ONLY A SINGLE PODCAST, THIS TIME VIA DEEP-LINKING OR BOOKMARK
//

app.get('/listen/podcast/:id', loadUser, function(req, res) {

	var podcastList = new Array(),
		construction = new Array();

	async.waterfall([
		function ( callback ) {
			Users.findOne({ $or : [ { 'username': req.session.userID }, { 'email': req.session.userID } ] }, function(err, result) {
				Feeds.find( { $or : [ { 'owner': result['email'] }, { 'owner': result['username'] } ], uuid: req.params.id }).toArray(function(err, results) {

					// NOT NECESSARY?
					var feed = new Array();

					feed = {
						feedTitle 		: results[0].title,
						feedDescription : results[0].description,
						feeduuid		: results[0].uuid
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
			});
		},
		function ( podcastList, callback ) {
			Users.findOne({ $or : [ { 'username': req.session.userID }, { 'email': req.session.userID } ] }, function(err, result) {
				Feeds.find( { $or : [ { 'owner': result['email'] }, { 'owner': result['username'] } ] } ).toArray(function(err, results) {

					for (var i = 0; i < results.length; ++i) {
						data = {
							feedTitle 		: results[i].title,
							feedDescription : results[i].description,
							feeduuid		: results[i].uuid
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
			});
		}
	], function () {
		Users.findOne({ $or : [ { 'username': req.session.userID }, { 'email': req.session.userID } ] }, function(err, result) {
			res.render('listen', {
				locals: {
					username: result['username'],
					feeds: construction,
					podcasts: podcastList,
					playing: result['playing']
				}
			});
		});
	});

});

//
//	LISTEN TO A PODCAST
//

app.post('/listen/:feed/:_id', loadUser, function(req, res) {

	var id = req.param('id'),
		feed = req.param('feed');

	Users.findOne({ $or : [ { 'username': req.session.userID }, { 'email': req.session.userID } ] }, function(err, result) {
		Feeds.find( { $or : [ { 'owner': result['email'] }, { 'owner': result['username'] } ], uuid: feed, 'pods.podUUID': id } ).toArray(function(err, results) {
			var i,
				podcastLink;
			for (i = 0; i < results[0].pods.length; ++i) {
				if ( results[0].pods[i].podUUID == id ) { 
					var podData = results[0].pods[i];
					podData['feedTitle'] = results[0].title;
					podData['feedUUID'] = results[0].uuid;
					res.partial('partials/player-playing', { playing: podData });
				}
			}
		});
	});
});

//
//	MARK A PODCAST AS "LISTENED"
//

app.post('/listen/:feed/listened/:_id', loadUser, function(req, res) {

	var id = req.param('id');

	Users.findOne({ $or : [ { 'username': req.session.userID }, { 'email': req.session.userID } ] }, function(err, result) {
		Feeds.findAndModify({ $or : [ { 'owner': result['email'] }, { 'owner': result['username'] } ] , 'pods.podUUID' : id }, [], { $set: { 'pods.$.listened' : 'true' } }, { new:true }, function(err, result) {
			if(err) { throw err; }
			res.send(result);
		});
	});

});

//
// UPDATE YOUR PODCASTS
//

app.post('/listen/update', loadUser, function(req, res) {

	var item,
		counter = 0,
		feedUUID,
		feedHREF,
		existingList = new Array(),
		newList = new Array(),
		newPodcastList = new Array();

	async.waterfall([
		function ( callback ) {
			// Step 1: Find all feeds from the user.
			Users.findOne({ $or : [ { 'username': req.session.userID }, { 'email': req.session.userID } ] }, function(err, result) {
				Feeds.find( { $or : [ { 'owner': result['email'] }, { 'owner': result['username'] } ] } ).toArray(function(err, result) {
					feeds = result;
					callback(null, feeds);
				});
			});
		},
		function ( feeds, callback ) {
			// Step 2: Iterate through the feeds, create a list of the existing items. Also, we grab some necessary data (uri, uuid).
			for ( var i = 0; i < feeds.length; ++i ) {
				if ( feeds != null ) {
					feedUUID = feeds[i].uuid,
					feedHREF = feeds[i].href;

					existingList = [];
					for ( var j = 0; j < feeds[i].pods.length; j++ ) {

						podData = { 'podFile'	: feeds[i].pods[j].podFile };
						existingList.push(podData);
					}
					callback(null, feeds, existingList, feedHREF, feedUUID);
				}
			}			
		},
		function ( feeds, existingList, feedHREF, feedUUID, callback ) {
			// Step 3: Request the XML from the RSS/Atom feed. Parse this for the necessary information, just like I do when adding a new feed.
			request({uri: feedHREF}, function(err, response, body){
				parser.parseString(body, function (err, xml) {

					var feed = xml.channel,
						j,
						pubDate,
						podData = new Array(),
						newList = [];

					for ( j = 0; j < 10; ++j ) {
						podData = {};

						if ( typeof feed.item[j] != "undefined" ) {
							if ( typeof feed.item[j].enclosure != "undefined" ) {

								if ( typeof feed.item[j]['pubDate'] == "string" ) {
									pubDate = moment(feed.item[j]['pubDate'], "dd\, DD MMM YYYY H:mm:ss Z")
								} else if ( typeof feed.item[j]['dc:date'] == "string" ) {
									pubDate = moment(feed.item[j]['dc:date'], "YYYY-MM-DD\TH:mm:ssZ");
								}

								podData = {
									'podTitle'	: feed.item[j].title,
									'podLink'	: feed.item[j].link,
									'podFile'	: feed.item[j].enclosure['@'].url,
									'podMedia'	: feed.item[j].media,
									'podDesc'	: feed.item[j].description,
									'podUUID'	: Math.round((new Date().valueOf() * Math.random())) + '',
									'podDate'	: pubDate,
									'prettyDay' : pubDate.format('D'),
									'prettyMonth' : pubDate.format('MMMM'),
									'prettyYear' : pubDate.format('YYYY'),
									'listened'	: 'false'
								};
								newList.push(podData);
							}
						}
					}
					counter++;
					callback(null, feeds, existingList, feedHREF, feedUUID, newList, counter);
				});
			});
		}, function ( feeds, existingList, feedHREF, feedUUID, newList, counter, callback ) {
			// Step 4: Iterate through the new list and the existing list. If items match, cut them. If not, push them to an array of only new podcasts.
			var newPodcastList = [],
				match,
				existingPodDate;

			for ( var k = 0; k < newList.length; ++k ) {
				match = false;
				for ( var j = 0; j < existingList.length; ++j ) {
					if ( newList[k].podFile == existingList[j].podFile ) { 
						match = true;
						break;
					}
				}
				
				if ( match === false ) { newPodcastList.push(newList[k]); }
			}

			callback(null, feeds, existingList, feedHREF, feedUUID, newList, counter, newPodcastList);

		}, function ( feeds, existingList, feedHREF, feedUUID, newList, counter, newPodcastList, callback ) {
			// Step 5: We take that list of new podcasts and funnel it into the proper item in the Feeds DB collection.
			if (  newPodcastList != [] ) {
				Users.findOne({ $or : [ { 'username': req.session.userID }, { 'email': req.session.userID } ] }, function(err, result) {
					Feeds.findAndModify({ 'owner': req.session.userID, 'uuid': feedUUID }, [], { $pushAll: { 'pods' : newPodcastList } }, { new:true }, function(err, result) {
						if (err) { throw err; }
					});
				});
			}

			callback();
		}
	], function () {
		if ( counter == feeds.length) {
			// Step 6: We use the counter to ensure that we only update the partial once all of the feeds have been updated.
			Users.findOne({ $or : [ { 'username': req.session.userID }, { 'email': req.session.userID } ] }, function(err, result) {
				getFeeds(result['email'], result['username'], function(error, feeds, podcastList) {
					res.partial('partials/podcasts', { feeds: feeds, podcasts: podcastList });
				});
			});
		}
	});

});

//
// 	SYNC
//

app.post('/listen/playing', loadUser, function(req, res) {
	var playing = req.body;

	Users.findAndModify({ $or : [ { 'username': req.session.userID }, { 'email': req.session.userID } ] }, [], { $set: { 'playing' : playing } }, { new:true }, function(err, result) {
		console.log('SYNC: ' + moment().format('dddd, MMMM Do YYYY, h:mm:ss a') + ' : ' + result);
		res.send(result);
	});
});

//
//	SETTINGS PAGE / FUNCTIONS
//

app.post('/settings', loadUser, function(req, res) {
	res.partial('partials/settings');
});

app.get('/settings', loadUser, function(req, res) {
	getFeeds(req.session.userID, function(error, feed, podcastList) {
		Users.findOne({ 'username': req.session.userID }, function(err, result) {
			var playing = result['playing'];
			res.render('settings', {
				locals: {
					username: req.session.userID,
					feeds: feed,
					podcasts: podcastList,
					playing: playing
				}
			});
		});
	});
});

app.post('/settings/update-password', loadUser, function(req, res) {

  Users.findOne({ $or : [ { 'username': req.session.userID }, { 'email': req.session.userID } ] }, function(err, result) {

  	var currentPassword = req.param('password-current'),
  		newPassword = req.param('password-new'),
  		validatePassword = req.param('password-validate');

  	if (err) { throw err; }
  	if (result == null) {
  		console.log('WTF?');
  	} else {

  		if ( newPassword === validatePassword ) {
  			bcrypt.compare(currentPassword, result.password, function(err, result) {
  				if (result === true) {
  					bcrypt.genSalt(10, 64, function(err, salt) {
  						bcrypt.hash(newPassword, salt, function(err, hash) {
  							Users.findAndModify({ $or : [ { 'username': req.session.userID }, { 'email': req.session.userID } ] }, [], { $set: { 'password' : hash, 'salt' : salt } }, { new:true }, function(err, result) {
  								if (err) { throw err; }
  								res.redirect('/settings');
  							});
  						});
  					});

  				} else {
  					req.flash('errorUpdatePassword', "The password you entered did not match your current password.");
  					res.render('settings', { username: req.session.userID, playing: null, flash: req.flash() });
  				}
  			});
  		} else {
  			req.flash('errorUpdatePasswordMatch', "The new passwords you entered do not match.");
  			res.render('settings', { username: req.session.userID, playing: null, flash: req.flash() });
  		}
  	}
  });

});

//
//	404
//

app.use(function(req, res){
	res.render('404');
});

//  ---------------------------------------
//	START THE SERVER!
//  ---------------------------------------

app.listen(3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);