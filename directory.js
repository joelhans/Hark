module.exports = function(app, express, loadUser, Directory, Feeds, moment, request, async, parser, ObjectID) {

//  directory.js
// 
//  This file handles all the functions relating to the podcast directory.
//
//  Order of functions:
//    * Render directory view.

  app.get('/directory', loadUser, function(req, res) {
    Directory.find({}).toArray(function(err, result) {
      if(err) { throw err; }
      res.render('directory', {
        locals: {
          directory: result,
          user: harkUser,
          playing: harkUser.playing
        }
      });
    });
  });

  app.post('/directory', loadUser, function(req, res) {
    Directory.find({}).toArray(function(err, result) {
      if(err) { throw err; }
      res.partial('directory/directory-structure', {
        locals: {
          directory: result,
          user: harkUser,
          playing: harkUser.playing
        }
      });
    });
  });

  app.post('/directory/subscribe/:uuid', loadUser, function(req, res) {
    Directory.findOne({ 'uuid' : req.params.uuid }, function(err, result) {
      if(err) { throw err; }

      if ( harkUser === false ) {
        res.status(500);
        req.flash('error', "You need to be logged in to do that! Please log in or create an account.");
        res.partial('layout/modal', { flash: req.flash() });
        return;
      }

      Feeds.findOne({ 'uuid' : req.params.uuid, 'owner': harkUser.userID }, function(err, resultTest) {
        if (resultTest === null) {
          if ( moment().diff(result.lastUpdated._d) > 10 ) {
            updateDirectoryFeed(result, function(newResult) {
              console.log('LISTENED:');
              console.log(newResult.pods[0].listened);
              newResult.owner = harkUser.userID;
              newResult.pods[0].listened = 'false';
              newResult._id = new ObjectID();
              Feeds.insert(newResult, {safe:true}, function(err, result) {
                if (err) { throw err; }
                res.send('Success.');
                console.log('DONE DONE DONE.');
              });
            });
          } else {
            console.log('No need to update.');
            result.owner = harkUser.userID;
            Feeds.insert(result, {safe:true}, function(err, result) {
              if (err) { throw err; }
              res.send('Success.');
            });
          }
        } else {
          res.status(500);
          req.flash('error', "You are already subscribed to that feed.");
          res.partial('layout/modal', { flash: req.flash() });
          return;
        }
      });
    });
  });

  app.get('/directory/category/:category', loadUser, function(req, res) {
    Directory.find({ 'categories' : { $in : [req.params.category] } }).toArray(function(err, result) {
      console.log(result);
      if(err) { throw err; }
      res.render('directory', {
        locals: {
          directory: result,
          user: harkUser,
          playing: harkUser.playing
        }
      });
    });
  });

  app.post('/directory/category/:category', loadUser, function(req, res) {
    Directory.find({ 'categories' : { $in : [req.params.category] } }).toArray(function(err, result) {
      console.log(result);
      if(err) { throw err; }
      res.partial('directory/directory-main', {
        locals: {
          directory: result,
          user: harkUser
        }
      });
    });
  });

  app.get('/directory/podcast/:uuid', loadUser, function(req, res) {
    Directory.findOne({ 'uuid' : req.params.uuid }, function(err, result) {
      if(err) { throw err; }
      console.log('RENDER');
      console.log(result);

    });
  });

updateDirectoryFeed = function(result, done) {
  async.waterfall([
    function ( callback ) {
      var item,
        counter = 0,
        feedUUID,
        feedHREF,
        existingList = new Array(),
        newList = new Array(),
        newPodcastList = new Array();

      request({uri: result.href}, function(err, response, body){
        parser.parseString(body, function (err, xml) {

          if (typeof(xml) === 'undefined') {
            console.log('Fuck.');
          } else {
            var feed = xml.channel,
              j,
              pubDate,
              listened,
              description
              podData = new Array(),
              newList = [];

            for ( var i = 0; i < 50; ++i ) {
              podData = {};

              if ( typeof feed.item[i] !== "undefined" ) {
                if ( typeof feed.item[i].enclosure !== "undefined" ) {

                  if ( typeof feed.item[i]['pubDate'] == "string" ) {
                    pubDate = moment(feed.item[i]['pubDate'], "ddd\, DD MMM YYYY H:mm:ss Z")
                  } else if ( typeof feed.item[i]['dc:date'] == "string" ) {
                    pubDate = moment(feed.item[i]['dc:date'], "YYYY-MM-DD\TH:mm:ssZ");
                  }

                  if( feed.item[i].description.indexOf('<script') != -1 )
                    description = feed.item[i].description.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
                  else
                    description = feed.item[i].description

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
                    'podDesc' : description,
                    'podUUID' : Math.round((new Date().valueOf() * Math.random())) + '',
                    'podDate' : pubDate,
                    'prettyDay' : pubDate.format('D'),
                    'prettyMonth' : pubDate.format('MMMM'),
                    'prettyYear' : pubDate.format('YYYY'),
                    'listened' : listened
                  };
                  newList.push(podData);
                }
              } else if ( typeof feed.item.title !== "undefined" ) {

                if ( typeof feed.item['pubDate'] == "string" ) {
                  pubDate = moment(feed.item['pubDate'], "ddd\, DD MMM YYYY H:mm:ss Z")
                } else if ( typeof feed.item['dc:date'] == "string" ) {
                  pubDate = moment(feed.item['dc:date'], "YYYY-MM-DD\TH:mm:ssZ");
                }

                if( feed.item.description.indexOf('<script') != -1 )
                  description = feed.item.description.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
                else
                  description = feed.item.description

                listened = 'false';

                podData = {
                    'podTitle'  : feed.item.title,
                    'podLink' : feed.item.link,
                    'podFile' : feed.item.enclosure['@'].url,
                    'podMedia'  : feed.item.media,
                    'podDesc' : description,
                    'podUUID' : Math.round((new Date().valueOf() * Math.random())) + '',
                    'podDate' : pubDate,
                    'prettyDay' : pubDate.format('D'),
                    'prettyMonth' : pubDate.format('MMMM'),
                    'prettyYear' : pubDate.format('YYYY'),
                    'listened' : listened
                  };
                newList.push(podData);
                break;
              } else if ( typeof feed.item[i] === "undefined" ) {
                break;
              }
            }
            counter++;
            callback(null, newList);
          }
        });
      });
    }, function (newList, callback) {
      existingList = [];
      for ( var j = 0; j < result.pods.length; j++ ) {
        existingList.push(result.pods[j]);
      }
      callback(null, newList, existingList);
    }, function (newList, existingList, callback) {
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

        callback(null, newList, existingList, newPodcastList);
    }, function (newList, existingList, newPodcastList, callback) {
      console.log(newPodcastList);
      if (typeof newPodcastList[0] !== 'undefined' && newPodcastList[0] !== null) {
        Directory.findAndModify({ 'url': result.url }, [], { $set: { 'pods' : newPodcastList, 'lastUpdated' : moment(), 'lastPodcast' : newPodcastList[0].podDate } }, { new:true }, function(err, newResult) {
          if (err) { throw err; }
          callback(null, newList, existingList, newPodcastList, newResult);
        });
      } else {
        newResult = result;
        callback(null, newList, existingList, newPodcastList, newResult);
      }
    }, function (newList, existingList, newPodcastList, newResult, callback) {
      done(newResult);
    }
  ]);
}

function dynamicSort(property) {
  return function (a,b) {
    return (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
  }
}

};