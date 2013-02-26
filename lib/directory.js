module.exports = function(app, express, loadUser, Directory, Feeds, moment, request, async, parser, ObjectID) {

//  directory.js
// 
//  This file handles all the functions relating to the podcast directory.
//

  //
  //  CRON
  //
  
  require('./directory/cron')(app, express, loadUser, Directory, Feeds, moment, request, async, parser, ObjectID);

  //
  //  DEFAULT VIEW
  //

  app.get('/directory', loadUser, function(req, res) {
    Directory.find({}).limit(10).sort([['subscriptions','descending']]).toArray(function(err, result) {
      if(err) { throw err; }
      res.render('directory', {
        locals: {
          directory: result,
          category: 'all',
          user: harkUser,
          playing: harkUser.playing,
          individual: false,
          page: 1,
          final_page: false
        }
      });
    });
  });

  app.post('/directory', loadUser, function(req, res) {
    Directory.find({}).limit(10).sort([['subscriptions','descending']]).toArray(function(err, result) {
      if(err) { throw err; }
      res.partial('directory/directory-structure', {
        locals: {
          directory: result,
          category: 'all',
          user: harkUser,
          playing: harkUser.playing,
          individual: false,
          page: 1,
          final_page: false
        }
      });
    });
  });

  //
  //  CATEGORIES
  //

  app.get('/directory/category/:category', loadUser, function(req, res) {
    Directory.find({ 'categories' : { $in : [req.params.category] } }).limit(10).toArray(function(err, result) {
      if(err) { throw err; }
      var final_page = false;
      if(result.length <= 9) { final_page = true; }
      res.render('directory', {
        locals: {
          directory: result,
          category: req.params.category,
          user: harkUser,
          playing: harkUser.playing,
          individual: false,
          page: 1,
          final_page: final_page
        }
      });
    });
  });

  app.post('/directory/category/:category', loadUser, function(req, res) {
    Directory.find({ 'categories' : { $in : [req.params.category] } }).limit(10).toArray(function(err, result) {
      if(err) { throw err; }
      var final_page = false;
      if(result.length <= 9) { final_page = true; }
      res.partial('directory/directory-main', {
        locals: {
          directory: result,
          category: req.params.category,
          user: harkUser,
          playing: harkUser.playing,
          individual: false,
          page: 1,
          final_page: final_page
        }
      });
    });
  });

  //
  //  PAGINATION
  //

   require('./directory/pagination')(app, express, loadUser, Directory, Feeds, moment, request, async, parser, ObjectID);

  //
  //  SORTING
  // 

  // app.post('/directory/sort-title', loadUser, function(req, res) {
  //   var page = req.params.page
  //     , min = page * 1 - 1
  //     , max = page * 1
  //   if (req.body.category) {
  //     Directory.find({ 'categories' : { $in : [req.body.category] } }).limit(20).skip(min).sort([['title','ascending']]).toArray(function(err, result) {
  //       if(err) { throw err; }
  //       res.partial('directory/directory-structure', {
  //         locals: {
  //           directory: result,
  //           category: 'all',
  //           user: harkUser,
  //           playing: harkUser.playing,
  //           individual: false,
  //           page: req.params.page
  //         }
  //       });
  //     });
  //   } else {
  //     Directory.find({}).limit(20).skip(min).sort([['title','ascending']]).toArray(function(err, result) {
  //       if(err) { throw err; }
  //       res.partial('directory/directory-structure', {
  //         locals: {
  //           directory: result,
  //           category: 'all',
  //           user: harkUser,
  //           playing: harkUser.playing,
  //           individual: false,
  //           page: req.params.page
  //         }
  //       });
  //     });
  //   }
  // });

  //
  //  SUBSCRIBE
  //

  require('./directory/subscribe')(app, express, loadUser, Directory, Feeds, moment, request, async, parser, ObjectID);

  //
  //  INDIVIDUAL PODCAST PAGES
  //

  require('./directory/individual')(app, express, loadUser, Directory, Feeds, moment, request, async, parser, ObjectID);

  //
  //  SEARCH
  //

  require('./directory/search')(app, express, loadUser, Directory, Feeds, moment, request, async, parser, ObjectID);

}