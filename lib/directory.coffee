module.exports = (app, express, loadUser, Users, Directory, Feeds, db, url, crypto, request, async, xml2js, nodemailer, bcrypt, moment, parser, ObjectID, passport) ->

  #####################################
  # DIRECTORY
  #####################################

  app.get '/directory', loadUser, (req, res) ->
    Directory.find({}).limit(10).sort([['subscriptions','descending']]).toArray (err, result) ->
      if err
        res.status(500)
        req.session.messages = 'Sorry, there was an error.'
        res.render 'layout/modal',
          messages : req.session.messages
        return

      res.render 'directory',
        directory  : result
        category   : 'all'
        user       : harkUser
        playing    : harkUser.playing
        individual : false
        page       : 1
        final_page : false

  #####################################
  # DIRECTORY, via AJAX
  #####################################

  app.post '/directory', loadUser, (req, res) ->
    Directory.find({}).limit(10).sort([['subscriptions','descending']]).toArray (err, result) ->
      if err
        res.status(500)
        req.session.messages = 'Sorry, there was an error.'
        res.render 'layout/modal',
          messages : req.session.messages
        return

      res.render 'directory/directory-structure',
        directory  : result
        category   : 'all'
        user       : harkUser
        playing    : harkUser.playing
        individual : false
        page       : 1
        final_page : false

  #####################################
  # CATEGORY
  #####################################

  app.get '/directory/category/:category', loadUser, (req, res) ->
    Directory.find({ 'categories' : { $in : [req.params.category] } }).limit(10).toArray (err, result) ->
      if err
        res.status(500)
        req.session.messages = 'Sorry, there was an error.'
        res.render 'layout/modal',
          messages : req.session.messages
        return

      final_page = false
      if (result.length <= 9)
        final_page = true

      res.render 'directory',
        directory  : result
        category   : req.params.category
        user       : harkUser
        playing    : harkUser.playing
        individual : false
        page       : 1
        final_page : final_page

  #####################################
  # CATEGORY, via AJAX
  #####################################

  app.post '/directory/category/:category', loadUser, (req, res) ->
    Directory.find({ 'categories' : { $in : [req.params.category] } }).limit(10).toArray (err, result) ->
      if err
        res.status(500)
        req.session.messages = 'Sorry, there was an error.'
        res.render 'layout/modal',
          messages : req.session.messages
        return

      final_page = false
      if (result.length <= 9)
        final_page = true

      res.render 'directory/directory-main',
        directory  : result
        category   : req.params.category
        user       : harkUser
        playing    : harkUser.playing
        individual : false
        page       : 1
        final_page : final_page

  #####################################
  # CRON
  #####################################

  require('./directory/cron')(app, express, loadUser, Directory, Feeds, moment, request, async, parser, ObjectID)

  #####################################
  # PAGINATION
  #####################################

  require('./directory/pagination')(app, express, loadUser, Directory, Feeds, moment, request, async, parser, ObjectID);

  #####################################
  # SUBSCRIBE
  #####################################

  require('./directory/subscribe')(app, express, loadUser, Directory, Feeds, moment, request, async, parser, ObjectID);

  #####################################
  # DIRECTORY, individual
  #####################################

  require('./directory/individual')(app, express, loadUser, Directory, Feeds, moment, request, async, parser, ObjectID);

  #####################################
  # SEARCH
  #####################################

  require('./directory/search')(app, express, loadUser, Directory, Feeds, moment, request, async, parser, ObjectID);