module.exports = function(app, express, loadUser, Directory, Feeds) {

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
          username: harkUser.username,
          playing: harkUser.playing
        }
      });
    });
  });

  app.post('/directory', loadUser, function(req, res) {
    Directory.find({}).toArray(function(err, result) {
      if(err) { throw err; }
      res.partial('partials/directory', {
        locals: {
          directory: result
        }
      });
    });
  });

  app.post('/directory/subscribe/:uuid', loadUser, function(req, res) {
    console.log(req.params.uuid);
    Directory.findOne({ 'uuid' : req.params.uuid }, function(err, result) {
      if(err) { throw err; }
      result.owner = harkUser.userID;
      result.pods[0].listened = false;
      console.log(result.pods[0].listened);
      Feeds.insert(result, {safe:true}, function(err, result) {
        res.send('Success.');
      });
    });
  });

  app.get('/directory/category/:category', loadUser, function(req, res) {
    Directory.find({ 'categories' : req.params.category }).toArray(function(err, result) {
      if(err) { throw err; }
      res.render('directory', {
        locals: {
          directory: result,
          username: harkUser.username,
          playing: harkUser.playing
        }
      });
    });
  });

};