module.exports = function(app, express, loadUser, Users, Feeds) {

//  directory.js
// 
//  This file handles all the functions relating to the podcast directory.
//
//  Order of functions:
//    * Nothing.

app.get('/directory', loadUser, function(req, res) {
  res.render('directory', {
      locals: {
        username: harkUser.username,
        playing: harkUser.playing
      }
    });
});

};