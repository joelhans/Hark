module.exports = function(app, express, loadUser, Directory) {

//  directory.js
// 
//  This file handles all the functions relating to the podcast directory.
//
//  Order of functions:
//    * Nothing.

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

};