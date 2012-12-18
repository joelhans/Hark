module.exports = function(app, express, loadUser, Users, Feeds, Directory, db, moment, ObjectID){

FeedCatches = require('./feeds_catches').FeedCatches;

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

          console.log(response, body);

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
              getFeeds(harkUser.userID, function(error, feed, podcastList) {
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
      getFeeds(harkUser.userID, function(error, feed, podcastList) {
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
      getFeeds(harkUser.userID, function(error, feed, podcastList) {
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


  // getFeeds = function(userID, callback) {

  //   var construction = new Array()
  //     , podcastList = new Array();

  //   Feeds.find( { 'owner': userID } ).toArray(function(err, results) {

  //     if (typeof results[0] === "undefined") {
  //       callback(null, [], []);
  //     } else {
        
  //       for (var i = 0; i < results.length; ++i) {
  //         data = {
  //           feedTitle       : results[i].title,
  //           feedDescription : results[i].description,
  //           feeduuid        : results[i].uuid
  //         }
  //         construction.push(data);
  //       }

  //       construction.sort(function (a , b) {
  //         if (a['feedTitle'].toLowerCase() > b['feedTitle'].toLowerCase())
  //           return 1;
  //         if (a['feedTitle'].toLowerCase() < b['feedTitle'].toLowerCase())
  //           return -1;
  //         return 0;
  //       });

  //       for (var i = 0; i < results.length; ++i) {
  //         for (var j = 0; j < results[i].pods.length; ++j) {
  //           var podData = results[i].pods[j];

  //           podData['feedTitle'] = results[i].title;
  //           podData['feedUUID'] = results[i].uuid;

  //           if ( results[i].pods[j].listened !== 'true' ) {
  //             podcastList.push(podData);
  //           }
  //         }
  //       }

  //       if (typeof podcastList[0] !== "undefined") {
  //         podcastList.sort(function (a , b) {
  //           var sort_a,
  //               sort_b;

  //           if (typeof(a['podDate']['_d']) == "object") {
  //             sort_a = moment(a['podDate']['_d']).valueOf();
  //           } else {
  //             sort_a = moment(a['podDate']).valueOf();
  //           }

  //           if (typeof(b['podDate']['_d']) == "object") {
  //             sort_b = moment(b['podDate']['_d']).valueOf();
  //           } else {
  //             sort_b = moment(b['podDate']).valueOf();
  //           }

  //           return sort_b - sort_a;
  //         });
  //       }

  //       callback(null, construction, podcastList);
  //     }
  //   });
  // }

  //
  // UPDATE YOUR PODCASTS
  //

  require('./lib/feeds/update')(app, express, loadUser, Directory, Feeds, moment, request, async, parser, ObjectID);


  // app.post('/listen/update', loadUser, function(req, res) {
  //   var item,
  //     counter = 0,
  //     feedUUID,
  //     feedHREF,
  //     existingList = new Array(),
  //     newList = new Array(),
  //     newPodcastList = new Array();

  //   async.waterfall([
  //     function ( callback ) {
  //       // Step 1: Find all feeds from the user.
  //       Feeds.find({ 'owner': harkUser.userID }).toArray(function(err, results) {
  //         feeds = results;
  //         callback(null, feeds);
  //       });
  //     },
  //     function ( feeds, callback ) {
  //       // Step 2: Iterate through the feeds, create a list of the existing items. Also, we grab some necessary data (uri, uuid).
  //       for ( var i = 0; i < feeds.length; ++i ) {
  //         if ( feeds[i] !== null ) {
  //           feedUUID = feeds[i].uuid,
  //           feedHREF = feeds[i].href;

  //           existingList = [];
  //           for ( var j = 0; j < feeds[i].pods.length; j++ ) {
  //             podData = { 'podFile' : feeds[i].pods[j].podFile };
  //             existingList.push(podData);
  //           }
  //           callback(null, feeds, existingList, feedHREF, feedUUID);
  //         }
  //       }     
  //     },
  //     function ( feeds, existingList, feedHREF, feedUUID, callback ) {
  //       // Step 3: Request the XML from the RSS/Atom feed. Parse this for the necessary information, just like I do when adding a new feed.
  //       request({uri: feedHREF}, function(err, response, body) { 
  //         if (typeof body === 'undefined') {
  //           newList = [];
  //           callback(null, feeds, existingList, feedHREF, feedUUID, newList, counter);
  //         } else {
  //           parser.parseString(body, function (err, xml) {
  //             if (typeof(xml) === 'undefined') {
  //               res.status(500);
  //               req.flash('error', "An error occured when updating a feed. Please try again in a few minutes.");
  //               res.partial('layout/modal', { flash: req.flash() });
  //               newList = [];
  //               callback(null, feeds, existingList, feedHREF, feedUUID, newList, counter);
  //             } else {
  //               var feed = xml.channel,
  //                 j,
  //                 pubDate,
  //                 description
  //                 podData = new Array(),
  //                 newList = [];

  //               for ( var i = 0; i < 10; ++i ) {
  //                 podData = {};

  //                 if ( typeof feed.item[i] !== "undefined" ) {
  //                   if ( typeof feed.item[i].enclosure !== "undefined" ) {

  //                     // PUBDATE //
  //                     if ( typeof feed.item[i]['pubDate'] == "string" ) {
  //                       pubDate = moment(feed.item[i]['pubDate'], "ddd\, DD MMM YYYY H:mm:ss Z").format();
  //                     } else if ( typeof feed.item[i]['dc:date'] == "string" ) {
  //                       pubDate = moment(feed.item[i]['dc:date'], "YYYY-MM-DD\TH:mm:ssZ").format();
  //                     }
  //                     // /PUBDATE //

  //                     // DESCRIPTION //
  //                     if (typeof(feed.item[i].description) !== "undefined" && typeof(feed.item[i].description) !== "object") {
  //                       description = feed.item[i].description.toString().replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
  //                     } else if (typeof(feed.item[i]['itunes:summary']) !== "undefined") {
  //                       description = feed.item[i]['itunes:summary'].toString().replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
  //                     } else {
  //                       description = 'No description available.'
  //                     }
  //                     // /DESCRIPTION //

  //                     // MEDIA //
  //                     if (typeof(feed.item[i].enclosure[0]) !== "undefined") {
  //                       podMedia = feed.item[i].enclosure[0]['@'].url
  //                     } else {
  //                       podMedia = feed.item[i].enclosure['@'].url
  //                     }
  //                     // /MEDIA //

  //                     podData = {
  //                       'podTitle'  : feed.item[i].title,
  //                       'podLink'   : feed.item[i].link,
  //                       'podFile'   : feed.item[i].enclosure['@'].url,
  //                       'podMedia'  : podMedia,
  //                       'podDesc'   : description,
  //                       'podUUID'   : Math.round((new Date().valueOf() * Math.random())) + '',
  //                       'podDate'   : pubDate,
  //                       'listened'  : 'false'
  //                     };
  //                     newList.push(podData);
  //                   }
  //                 } else if ( typeof feed.item.title !== "undefined" ) {

  //                   // PUBDATE //
  //                   if ( typeof feed.item['pubDate'] == "string" ) {
  //                     pubDate = moment(feed.item['pubDate'], "ddd\, DD MMM YYYY H:mm:ss Z").format();
  //                   } else if ( typeof feed.item['dc:date'] == "string" ) {
  //                     pubDate = moment(feed.item['dc:date'], "YYYY-MM-DD\TH:mm:ssZ").format();
  //                   }
  //                   // /PUBDATE //

  //                   // DESCRIPTION //
  //                   if (typeof(feed.item.description) !== "undefined" && typeof(feed.item.description) !== "object") {
  //                     description = feed.item.description.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
  //                   } else if (typeof(feed.item['itunes:summary']) !== "undefined") {
  //                     description = feed.item['itunes:summary'].replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
  //                   } else {
  //                     description = 'No description available. Sorry.'
  //                   }
  //                   // /DESCRIPTION //

  //                   // MEDIA //
  //                   if (typeof(feed.item.enclosure) !== "undefined") {
  //                     if (typeof(feed.item.enclosure[0]) !== "undefined") {
  //                       podMedia = feed.item.enclosure[0]['@'].url
  //                     } else {
  //                       podMedia = feed.item.enclosure['@'].url
  //                     }
  //                   } else {
  //                     podMedia = "Something went very wrong."
  //                     description = "Something went very wrong."
  //                   }
  //                   // /MEDIA //

  //                   podData = {
  //                       'podTitle'    : feed.item.title,
  //                       'podLink'     : feed.item.link,
  //                       'podFile'     : podMedia,
  //                       'podDesc'     : description,
  //                       'podUUID'     : Math.round((new Date().valueOf() * Math.random())) + '',
  //                       'podDate'     : pubDate,
  //                       'listened'    : 'false'
  //                     };
  //                   newList.push(podData);
  //                   break;
  //                 } else if ( typeof feed.item[i] === "undefined" ) {
  //                   break;
  //                 }
  //               }
  //               counter++;
  //               callback(null, feeds, existingList, feedHREF, feedUUID, newList, counter);
  //             }
  //           });
  //         }
  //       });
  //     }, function ( feeds, existingList, feedHREF, feedUUID, newList, counter, callback ) {
  //       // Step 4: Iterate through the new list and the existing list. If items match, cut them. If not, push them to an array of only new podcasts.
  //       var newPodcastList = [],
  //         match,
  //         existingPodDate;

  //       for ( var k = 0; k < newList.length; ++k ) {
  //         match = false;
  //         for ( var j = 0; j < existingList.length; ++j ) {
  //           if ( newList[k].podFile == existingList[j].podFile ) { 
  //             match = true;
  //             break;
  //           }
  //         }
          
  //         if ( match === false ) { newPodcastList.push(newList[k]); }
  //       }

  //       callback(null, feeds, existingList, feedHREF, feedUUID, newList, counter, newPodcastList);

  //     }, function ( feeds, existingList, feedHREF, feedUUID, newList, counter, newPodcastList, callback ) {
  //       // Step 5: We take that list of new podcasts and funnel it into the proper item in the Feeds DB collection.
  //       if (  newPodcastList != [] ) {
  //         Feeds.findAndModify({ 'owner': harkUser.userID, 'uuid': feedUUID }, [], { $pushAll: { 'pods' : newPodcastList } }, { new:true }, function(err, result) {
  //           if (err) { throw err; }
  //         });
  //       }

  //       callback();
  //     }
  //   ], function () {
  //     if ( counter == feeds.length) {
  //       // Step 6: We use the counter to ensure that we only update the partial once all of the feeds have been updated.
  //       getFeeds(harkUser.userID, function(error, feed, podcastList) {
  //         res.partial('listen/listen-main', { feeds: feed, podcasts: podcastList });
  //       });
  //     }
  //   });
  // });

};