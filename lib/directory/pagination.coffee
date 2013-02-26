module.exports = (app, express, loadUser, Directory, Feeds, moment, request, async, parser, ObjectID) ->

  app.post '/directory/page/:page', loadUser, (req, res) ->
    page       = req.params.page
    final_page = false
    min        = page * 10 - 10
    max        = page * 10

    #
    # First, we check if there is any category associated with the POST. If so, 
    # we are in a category.
    #
    if (req.body.category)

      #
      # We have to first count the number of items in the category.
      # After that, we send a general query to to the database.
      #
      Directory.count { 'categories' : { $in : [req.body.category] } }, (err, count) ->
        Directory.find({ 'categories' : { $in : [req.body.category] } }).limit(10).skip(min).sort([['subscriptions','descending']]).toArray (err, result) ->
          #
          # If there's an error...
          #
          if err
            res.status(500)
            req.flash 'error', 'Sorry, there was an error.'
            res.partial 'layout/modal', { flash: req.flash() }
            return

          #
          # We check if we should build out another page or not.
          #
          if max >= count
            final_page = true
          console.log page, max, count, final_page

          #
          # If everything goes as planned, we send our data to the client.
          #
          res.partial 'directory/directory-structure',
            locals:
              directory  : result
              user       : harkUser
              category   : req.body.category
              playing    : harkUser.playing
              individual : false
              page       : page
              final_page : final_page

    #
    # If not, we are in the main directory.
    #
    else
     #
      # We have to first count the number of items in the whole collection.
      # After that, we send a general query to to the database.
      #
      Directory.count {}, (err, count) ->
        Directory.find({}).limit(10).skip(min).sort([['subscriptions','descending']]).toArray (err, result) ->
          #
          # If there's an error...
          #
          if err
            res.status(500)
            req.flash 'error', 'Sorry, there was an error.'
            res.partial 'layout/modal', { flash: req.flash() }
            return
          
          #
          # We check if we should build out another page or not.
          #
          console.log page, max, count
          if max >= count
            final_page = true
          console.log page, max, count, final_page

          #
          # If everything goes as planned, we send our data to the client.
          #
          res.partial 'directory/directory-structure',
            locals:
              directory  : result
              user       : harkUser
              category   : req.body.category
              playing    : harkUser.playing
              individual : false
              page       : page
              final_page : final_page