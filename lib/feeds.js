module.exports = function(app, express, loadUser, Users, Feeds, Directory, db, moment, ObjectID){

FeedCatches = require('./feeds/catches').FeedCatches;

var request = require('request')
  , xml2js = require('xml2js')
  , moment = require('moment')
  , async = require('async')
  , url = require('url');

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
    var parsedURL = url.parse(req.body.url);
    console.log(parsedURL.protocol);
    if (parsedURL.protocol !== 'http:' && parsedURL.protocol !== 'https:') {
      res.status(500);
      req.flash('error', "The feed must begin with http: or https:. Please check the feed you're trying to input and try again.");
      res.partial('layout/modal', { flash: req.flash() });
      return;
    }

    Feeds.findOne({ 'owner': harkUser.userID, 'href': req.body.url }, function(err, result) {
      if ( result !== null ) {
        res.status(500);
        req.flash('error', "You already added that feed!");
        res.partial('layout/modal', { flash: req.flash() });
        return;
      } else {
        request({uri: req.body.url}, function(error, response, body){
          if ( error ) {
            res.status(500);
            req.flash('error', "An error occured.");
            res.partial('layout/modal', { flash: req.flash() });
            return;
          }

          parser.parseString(body, function (err, result) {
            if (typeof result === "undefined") {
              res.status(500);
              req.flash('error', "An error occured when adding that feed. Check the URL and try again.");
              res.partial('layout/modal', { flash: req.flash() });
              return;
            }

            var feed = result.channel,
              mediaType,
              pubDate,
              listened,
              podMedia,
              description,
              construction = new Array(),
              podData = new Array();

            for (var i = 0; i < 500; ++i ) {
              podData = {};
              
              if ( typeof feed.item[i] !== "undefined" ) {
                if ( typeof feed.item[i].enclosure !== "undefined" ) {

                  if ( i === 0 ) {
                    listened = 'false';
                  } else {
                    listened = 'true';
                  }

                  // PUBDATE //
                  if ( typeof feed.item[i]['pubDate'] == "string" ) {
                    pubDate = moment(feed.item[i]['pubDate'], "ddd\, DD MMM YYYY H:mm:ss Z").format();
                  } else if ( typeof feed.item[i]['dc:date'] == "string" ) {
                    pubDate = moment(feed.item[i]['dc:date'], "YYYY-MM-DD\TH:mm:ssZ").format();
                  }
                  // /PUBDATE //

                  // DESCRIPTION //
                  if (typeof(feed.item[i].description) !== "undefined") {
                    description = feed.item[i].description.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
                  } else if (typeof(feed.item[i]['itunes:summary']) !== "undefined") {
                    description = feed.item[i]['itunes:summary'].replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
                  } else {
                    break;
                  }
                  // /DESCRIPTION //

                  // MEDIA //
                  if (typeof(feed.item[i].enclosure[0]) !== "undefined") {
                    podMedia = feed.item[i].enclosure[0]['@'].url
                  } else {
                    podMedia = feed.item[i].enclosure['@'].url
                  }
                  // /MEDIA //

                  podData = {
                    'podTitle' : feed.item[i].title,
                    'podLink'  : feed.item[i].link,
                    'podFile'  : podMedia,
                    'podDesc'  : description,
                    'podUUID'  : Math.round((new Date().valueOf() * Math.random())) + '',
                    'podDate'  : pubDate,
                    'listened' : listened
                  };
                  construction.push(podData);
                }
              } else if ( typeof feed.item.title !== "undefined" ) {

                  listened = 'false';

                  // PUBDATE //
                  if ( typeof feed.item['pubDate'] == "string" ) {
                    pubDate = moment(feed.item['pubDate'], "ddd\, DD MMM YYYY H:mm:ss Z").format();
                  } else if ( typeof feed.item['dc:date'] == "string" ) {
                    pubDate = moment(feed.item['dc:date'], "YYYY-MM-DD\TH:mm:ssZ").format();
                  }
                  // /PUBDATE //

                  // DESCRIPTION //
                  if (typeof(feed.item.description) !== "undefined") {
                    description = feed.item.description.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
                  } else if (typeof(feed.item['itunes:summary']) !== "undefined") {
                    description = feed.item['itunes:summary'].replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
                  } else {
                    break;
                  }
                  // /DESCRIPTION //

                  // MEDIA //
                  if (typeof(feed.item.enclosure[0]) !== "undefined") {
                    podMedia = feed.item.enclosure[0]['@'].url
                  } else {
                    podMedia = feed.item.enclosure['@'].url
                  }
                  // /MEDIA //

                podData = {
                    'podTitle'  : feed.item.title,
                    'podLink' : feed.item.link,
                    'podFile' : podMedia,
                    'podDesc' : description,
                    'podUUID' : Math.round((new Date().valueOf() * Math.random())) + '',
                    'podDate' : pubDate,
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
                owner         : harkUser.userID,
                source        : 'owner'
            }

            Feeds.insert(feedData, {safe: true}, function() {
              getFeeds(harkUser.userID, 'all', function(error, feed, podcastList) {
                res.partial('listen/listen-structure', { 
                  feeds: feed,
                  podcasts: podcastList,
                  user: harkUser,
                  playing: harkUser.playing
                });
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
    Feeds.findAndModify({ 'owner': harkUser.userID, 'uuid': req.body.feedID }, [], { $set: { 'title' : req.body.feedName } }, { new:true }, function(err, result) {
      getFeeds(harkUser.userID, 'all', function(error, feed, podcastList) {
        res.partial('listen/listen-structure', { 
          feeds: feed,
          podcasts: podcastList,
          user: harkUser,
          playing: harkUser.playing
        });
      });
    });
  });

  //
  //  REMOVE A PODCAST SUBSCRIPTION
  //

  app.post('/listen/remove/:_id', loadUser, function(req, res) {
    Feeds.findAndModify({ 'owner': harkUser.userID, 'uuid': req.body.feedID }, [], {}, { remove:true }, function(err, result) {
      Directory.findAndModify({ 'uuid' : req.body.feedID }, {}, {$inc : { 'subscriptions' : -1 }}, {}, function(err, result) {
        if(err) { throw err; }
      });
      getFeeds(harkUser.userID, 'all', function(error, feed, podcastList) {
          res.partial('listen/listen-structure', { 
            feeds: feed,
            podcasts: podcastList,
            user: harkUser,
            playing: harkUser.playing
          });    
      });
    });
  });

  //
  //  GET FEEDS / PODCASTS
  //

  getFeeds = require('./feeds/get_feeds')(app, express, loadUser, Directory, Feeds, moment, request, async, parser, ObjectID);

  //
  // UPDATE YOUR PODCASTS
  //

  require('./feeds/update')(app, express, loadUser, Directory, Feeds, moment, request, async, parser, ObjectID);

};