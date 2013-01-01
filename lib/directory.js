module.exports = function(app, express, loadUser, Directory, Feeds, moment, request, async, parser, ObjectID) {

//  directory.js
// 
//  This file handles all the functions relating to the podcast directory.
//
//  Order of functions:
//    * Render directory view.

  //
  // Cron job
  //
  
  require('./directory/cron')(app, express, loadUser, Directory, Feeds, moment, request, async, parser, ObjectID);

  app.get('/directory', loadUser, function(req, res) {
    Directory.find({}).limit(20).sort([['subscriptions','descending']]).toArray(function(err, result) {
    // Directory.find({}, {}).sort([['subscriptions','descending']]).toArray(function(err, result) {
      if(err) { throw err; }
      res.render('directory', {
        locals: {
          directory: result,
          category: 'all',
          user: harkUser,
          playing: harkUser.playing,
          page: 1
        }
      });
    });
  });

  app.post('/directory', loadUser, function(req, res) {
    Directory.find({}).limit(20).sort([['subscriptions','descending']]).toArray(function(err, result) {
    // Directory.find({}, {}).sort([['subscriptions','descending']]).toArray(function(err, result) {
      if(err) { throw err; }
      res.partial('directory/directory-structure', {
        locals: {
          directory: result,
          category: 'all',
          user: harkUser,
          playing: harkUser.playing,
          page: 1
        }
      });
    });
  });

  //
  //  PAGINATION
  //

  app.post('/directory/page/:page', loadUser, function(req, res) {
    var page = req.params.page
      , min = page * 1 - 1
      , max = page * 1
    if (req.body.category) {
      Directory.find({ 'categories' : { $in : [req.body.category] } }).limit(20).skip(min).sort([['subscriptions','descending']]).toArray(function(err, result) {
        if(err) { throw err; }
        res.partial('directory/directory-structure', {
          locals: {
            directory: result,
            category: 'all',
            user: harkUser,
            playing: harkUser.playing,
            page: req.params.page
          }
        });
      });
    } else {
      Directory.find({}).limit(20).skip(min).sort([['subscriptions','descending']]).toArray(function(err, result) {
        if(err) { throw err; }
        res.partial('directory/directory-structure', {
          locals: {
            directory: result,
            category: 'all',
            user: harkUser,
            playing: harkUser.playing,
            page: req.params.page
          }
        });
      });
    }
  });

  //
  //  SORTING
  // 

  app.post('/directory/sort-title', loadUser, function(req, res) {
    var page = req.params.page
      , min = page * 1 - 1
      , max = page * 1
    if (req.body.category) {
      Directory.find({ 'categories' : { $in : [req.body.category] } }).limit(20).skip(min).sort([['title','ascending']]).toArray(function(err, result) {
        if(err) { throw err; }
        res.partial('directory/directory-structure', {
          locals: {
            directory: result,
            category: 'all',
            user: harkUser,
            playing: harkUser.playing,
            page: req.params.page
          }
        });
      });
    } else {
      Directory.find({}).limit(20).skip(min).sort([['title','ascending']]).toArray(function(err, result) {
        if(err) { throw err; }
        res.partial('directory/directory-structure', {
          locals: {
            directory: result,
            category: 'all',
            user: harkUser,
            playing: harkUser.playing,
            page: req.params.page
          }
        });
      });
    }
  });

  //
  //  SUBSCRIBE
  //

  require('./directory/subscribe')(app, express, loadUser, Directory, Feeds, moment, request, async, parser, ObjectID);

  app.get('/directory/category/:category', loadUser, function(req, res) {
    Directory.find({ 'categories' : { $in : [req.params.category] } }).limit(20).toArray(function(err, result) {
      if(err) { throw err; }
      res.render('directory', {
        locals: {
          directory: result,
          category: req.params.category,
          user: harkUser,
          playing: harkUser.playing,
          page: 1
        }
      });
    });
  });

  app.post('/directory/category/:category', loadUser, function(req, res) {
    Directory.find({ 'categories' : { $in : [req.params.category] } }).limit(20).toArray(function(err, result) {
      if(err) { throw err; }
      res.partial('directory/directory-main', {
        locals: {
          directory: result,
          category: req.params.category,
          user: harkUser,
          playing: harkUser.playing,
          page: 1
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