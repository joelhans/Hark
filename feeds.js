module.exports = function(app, express, loadUser, Users, Feeds, req){

//  feeds.js
// 
//  This file handles all the functions relating to RSS feeds.
//
//  Order of functions:
//    * Function to get, return all a user's feeds/subscriptions.
//    * Editing feeds
//    * Get all of a user's feeds/podcasts.

  // function getAllFeeds(req, getFeeds) {
  //   Users.findOne({ $or : [ { 'username': req.session.userID }, { 'email': req.session.userID } ] }, function(err, result) {
  //     getFeeds(result['email'], result['username'], function(error, feeds, podcastList) {
  //       res.partial('partials/podcasts', { feeds: feeds, podcasts: podcastList });
  //     });
  //   });
  // }

  //
  //  EDIT A PODCAST SUBSCRIPTION
  //

  app.post('/listen/edit/:_id', loadUser, function(req, res) {
    console.log('Oh, yeah!');

    var id = req.param('id')
    , newTitle = req.param('feedName');

    Users.findOne({ $or : [ { 'username': req.session.userID }, { 'email': req.session.userID } ] }, function(err, user) {
      Feeds.findAndModify({ $or : [ { 'owner': user['email'] }, { 'owner': user['username'] } ] , 'uuid' : id }, [], { $set: { 'title' : newTitle } }, { new:true }, function(err, result) {
        getFeeds(user['email'], user['username'], function(error, feeds, podcastList) {
          res.partial('partials/podcasts', { feeds: feeds, podcasts: podcastList });
        });
      });
    });

  });

  //
  //  GET FEEDS / PODCASTS
  //

  getFeeds = function(email, username, callback) {

    var construction = new Array()
      , podcastList = new Array();

    Feeds.find( { $or : [ { 'owner': email }, { 'owner': username } ] } ).toArray(function(err, results) {

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

};