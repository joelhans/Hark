module.exports = function(app, express, loadUser, Directory, Feeds, moment, request, async, parser, ObjectID) {

//  directory.js
// 
//  This file handles all the functions relating to the podcast directory.
//
//  Order of functions:
//    * Render directory view.

  app.get('/directory', loadUser, function(req, res) {
    Directory.find({}).sort([['lastPodcast','ascending']]).toArray(function(err, result) {
      if(err) { throw err; }
      res.render('directory', {
        locals: {
          directory: result,
          category: 'all',
          user: harkUser,
          playing: harkUser.playing,
          count: result.length
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
          category: 'all',
          user: harkUser,
          playing: harkUser.playing,
          count: result.length
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
        if (resultTest === null) { // This means we can go ahead with adding the feed.
          result.owner = harkUser.userID;
          result._id = new ObjectID();
          result.pods[0].listened = 'false';
          Feeds.insert(result, {safe:true}, function(err, result) {
            if (err) { throw err; }
            res.send('Success.');
          });
          Directory.findAndModify({ 'uuid' : req.params.uuid }, {}, {$inc : { 'subscriptions' : 1 }}, {}, function(err, result) {
            if(err) { throw err; }
          });
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
      if(err) { throw err; }
      res.render('directory', {
        locals: {
          directory: result,
          category: req.params.category,
          user: harkUser,
          playing: harkUser.playing,
          count: result.length
        }
      });
    });
  });

  app.post('/directory/category/:category', loadUser, function(req, res) {
    Directory.find({ 'categories' : { $in : [req.params.category] } }).toArray(function(err, result) {
      if(err) { throw err; }
      res.partial('directory/directory-main', {
        locals: {
          directory: result,
          category: req.params.category,
          user: harkUser,
          count: result.length
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

}