module.exports = function(app, express, loadUser, Users, Feeds, db){

var request = require('request')
  , xml2js = require('xml2js')
  , moment = require('moment')
  , async = require('async');

var parser = new xml2js.Parser();

//  feeds.js
// 
//  This file handles all the functions relating to RSS feeds.
//
//  Order of functions:
//    * Function to get, return all a user's feeds/subscriptions.
//    * Editing feeds
//    * Get all of a user's feeds/podcasts.
//    * Update subscriptions.

  //
  // ADD A PODCAST SUBSCRIPTION
  //

  app.post('/listen/add', loadUser, function(req, res) {
    Feeds.findOne({ 'userID': harkUser, 'href': req.body.url }, function(err, result) {
      if ( result !== null ) {
        req.flash('errorAddFeed', "You already added that feed!");
        getFeeds(harkUser.userID, function(error, feed, podcastList) {
          res.partial('partials/podcasts', { feeds: feed, podcasts: podcastList, flash: req.flash() });    
        });
        return;
      } else {
        request({uri: req.body.url}, function(error, response, body){

          if ( error ) {
            req.flash('errorAddFeed', "An error occured.");
            getFeeds(harkUser.userID, function(error, feed, podcastList) {
              res.partial('partials/podcasts', { feeds: feed, podcasts: podcastList, flash: req.flash() });    
            });
            return;
          }

          parser.parseString(body, function (err, result) {

            if (typeof result === "undefined") {
              req.flash('errorAddFeed', "An error occured when adding that feed. Check the URL and try again.");
              getFeeds(harkUser.userID, function(error, feed, podcastList) {
                res.partial('partials/podcasts', { feeds: feed, podcasts: podcastList, flash: req.flash() });    
              });
            }

            var feed = result.channel,
              mediaType,
              pubDate,
              listened,
              construction = new Array(),
              podData = new Array();

            for (var i = 0; i < 500; ++i ) {
              podData = {};
              
              if ( typeof feed.item[i] !== "undefined" ) {
                if ( typeof feed.item[i].enclosure !== "undefined" ) {

                  if ( typeof feed.item[i]['pubDate'] == "string" ) {
                    pubDate = moment(feed.item[i]['pubDate'], "ddd\, DD MMM YYYY H:mm:ss Z")
                  } else if ( typeof feed.item[i]['dc:date'] == "string" ) {
                    pubDate = moment(feed.item[i]['dc:date'], "YYYY-MM-DD\TH:mm:ssZ");
                  }

                  if ( i === 0 ) {
                    listened = 'false';
                  } else {
                    listened = 'true';
                  }

                  podData = {
                    'podTitle'  : feed.item[i].title,
                    'podLink' : feed.item[i].link,
                    'podFile' : feed.item[i].enclosure['@'].url,
                    'podMedia'  : feed.item[i].media,
                    'podDesc' : feed.item[i].description,
                    'podUUID' : Math.round((new Date().valueOf() * Math.random())) + '',
                    'podDate' : pubDate,
                    'prettyDay' : pubDate.format('D'),
                    'prettyMonth' : pubDate.format('MMMM'),
                    'prettyYear' : pubDate.format('YYYY'),
                    'listened'  : listened
                  };
                  construction.push(podData);
                }
              } else if ( typeof feed.item.title !== "undefined" ) {
                if ( typeof feed.item['pubDate'] == "string" ) {
                  pubDate = moment(feed.item['pubDate'], "ddd\, DD MMM YYYY H:mm:ss Z")
                } else if ( typeof feed.item['dc:date'] == "string" ) {
                  pubDate = moment(feed.item['dc:date'], "YYYY-MM-DD\TH:mm:ssZ");
                }
                
                listened = 'false';

                podData = {
                    'podTitle'  : feed.item.title,
                    'podLink' : feed.item.link,
                    'podFile' : feed.item.enclosure['@'].url,
                    'podMedia'  : feed.item.media,
                    'podDesc' : feed.item.description,
                    'podUUID' : Math.round((new Date().valueOf() * Math.random())) + '',
                    'podDate' : pubDate,
                    'prettyDay' : pubDate.format('D'),
                    'prettyMonth' : pubDate.format('MMMM'),
                    'prettyYear' : pubDate.format('YYYY'),
                    'listened'  : listened
                  };
                construction.push(podData);
                break;
              } else {
                break;
              }
            }

            var feedData = {
                title         : feed.title,
                href          : req.body.url,
                description   : feed.description,
                pods          : construction,
                uuid          : Math.round((new Date().valueOf() * Math.random())) + '',
                owner         : harkUser.userID
            }

            Feeds.insert(feedData, {safe: true}, function() {
              getFeeds(harkUser.userID, function(error, feed, podcastList) {
                res.partial('partials/podcasts', { feeds: feed, podcasts: podcastList });    
              });
            });
          });
        });
      }
    });
  });

  //
  //  EDIT A PODCAST SUBSCRIPTION
  //

  app.post('/listen/edit/:_id', loadUser, function(req, res) {
    Feeds.findAndModify({ 'owner': harkUser, 'uuid': req.param('id') }, [], { $set: { 'title' : req.param('feedName') } }, { new:true }, function(err, result) {
      getFeeds(harkUser.userID, function(error, feed, podcastList) {
        res.partial('partials/podcasts', { feeds: feed, podcasts: podcastList });    
      });
    });
  });

  //
  //  REMOVE A PODCAST SUBSCRIPTION
  //

  app.post('/listen/remove/:_id', loadUser, function(req, res) {
    Feeds.findAndModify({ 'owner': harkUser, 'uuid': req.param('id') }, [], {}, { remove:true }, function(err, result) {
      getFeeds(harkUser.userID, function(error, feed, podcastList) {
          res.partial('partials/podcasts', { feeds: feed, podcasts: podcastList });    
      });
    });
  });

  //
  //  GET FEEDS / PODCASTS
  //

  getFeeds = function(userID, callback) {

    var construction = new Array()
      , podcastList = new Array();

    console.log('Our getFeeds userID: ' + userID);

    Feeds.find( { 'owner': userID } ).toArray(function(err, results) {

      if (typeof results[0] === "undefined") {
        callback(null, [], []);
      } else {
        
        for (var i = 0; i < results.length; ++i) {
          data = {
            feedTitle       : results[i].title,
            feedDescription : results[i].description,
            feeduuid        : results[i].uuid
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

        for (var i = 0; i < results.length; ++i) {
          for (var j = 0; j < results[i].pods.length; ++j) {
            var podData = results[i].pods[j];

            podData['feedTitle'] = results[i].title;
            podData['feedUUID'] = results[i].uuid;

            if ( results[i].pods[j].listened != "true" ) {
              podcastList.push(podData);
            }
          }
        }

        if (typeof podcastList[0] !== "undefined") {
          podcastList.sort(function (a , b) {
            if (a['podDate']['_d'] > b['podDate']['_d'])
              return -1;
            if (a['podDate']['_d'] < b['podDate']['_d'])
              return 1;
            return 0;
          });
        }

        callback(null, construction, podcastList);
      }
    });
  }

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
        Feeds.find({ 'owner': harkUser.userID }).toArray(function(err, results) {
          feeds = results;
          callback(null, feeds);
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
              podData = { 'podFile' : feeds[i].pods[j].podFile };
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

            if (typeof(xml) === 'undefined') {
              req.flash('errorAddFeed', "There was an error with one of your feeds. Maybe the site is currently down. The affected podcast is at: " + feedHREF + '. The rest of your podcasts will update normally.');
              getFeeds(harkUser.userID, function(error, feed, podcastList) {
                res.partial('partials/podcasts', { feeds: feed, podcasts: podcastList, flash: req.flash() });    
              });
              newList = [];
              callback(null, feeds, existingList, feedHREF, feedUUID, newList, counter);
            } else {
              var feed = xml.channel,
                j,
                pubDate,
                podData = new Array(),
                newList = [];

              for ( var i = 0; i < 10; ++i ) {
                podData = {};

                if ( typeof feed.item[i] !== "undefined" ) {
                  if ( typeof feed.item[i].enclosure !== "undefined" ) {

                    if ( typeof feed.item[i]['pubDate'] == "string" ) {
                      pubDate = moment(feed.item[i]['pubDate'], "ddd\, DD MMM YYYY H:mm:ss Z")
                    } else if ( typeof feed.item[i]['dc:date'] == "string" ) {
                      pubDate = moment(feed.item[i]['dc:date'], "YYYY-MM-DD\TH:mm:ssZ");
                    }

                    podData = {
                      'podTitle'  : feed.item[i].title,
                      'podLink' : feed.item[i].link,
                      'podFile' : feed.item[i].enclosure['@'].url,
                      'podMedia'  : feed.item[i].media,
                      'podDesc' : feed.item[i].description,
                      'podUUID' : Math.round((new Date().valueOf() * Math.random())) + '',
                      'podDate' : pubDate,
                      'prettyDay' : pubDate.format('D'),
                      'prettyMonth' : pubDate.format('MMMM'),
                      'prettyYear' : pubDate.format('YYYY'),
                      'listened'  : 'false'
                    };
                    newList.push(podData);
                  }
                } else if ( typeof feed.item.title !== "undefined" ) {

                  if ( typeof feed.item['pubDate'] == "string" ) {
                    pubDate = moment(feed.item['pubDate'], "ddd\, DD MMM YYYY H:mm:ss Z")
                  } else if ( typeof feed.item['dc:date'] == "string" ) {
                    pubDate = moment(feed.item['dc:date'], "YYYY-MM-DD\TH:mm:ssZ");
                  }

                  podData = {
                      'podTitle'  : feed.item.title,
                      'podLink' : feed.item.link,
                      'podFile' : feed.item.enclosure['@'].url,
                      'podMedia'  : feed.item.media,
                      'podDesc' : feed.item.description,
                      'podUUID' : Math.round((new Date().valueOf() * Math.random())) + '',
                      'podDate' : pubDate,
                      'prettyDay' : pubDate.format('D'),
                      'prettyMonth' : pubDate.format('MMMM'),
                      'prettyYear' : pubDate.format('YYYY'),
                      'listened'  : 'false'
                    };
                  newList.push(podData);
                  break;
                } else if ( typeof feed.item[i] === "undefined" ) {
                  break;
                }
              }
              counter++;
              callback(null, feeds, existingList, feedHREF, feedUUID, newList, counter);
            }
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
          Feeds.findAndModify({ 'owner': harkUser, 'uuid': feedUUID }, [], { $pushAll: { 'pods' : newPodcastList } }, { new:true }, function(err, result) {
            if (err) { throw err; }
          });
        }

        callback();
      }
    ], function () {
      if ( counter == feeds.length) {
        // Step 6: We use the counter to ensure that we only update the partial once all of the feeds have been updated.
        getFeeds(harkUser.userID, function(error, feed, podcastList) {
          res.partial('partials/podcasts', { feeds: feed, podcasts: podcastList });
        });
      }
    });
  });

};