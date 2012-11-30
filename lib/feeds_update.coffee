module.exports = (app, express, loadUser, Directory, Feeds, moment, request, async, parser, ObjectID) ->

  FeedCatches = require('./feeds_catches').FeedCatches

  to_update       = null
  req_build       = []
  existing_build  = []
  new_build       = []

  # Run the first function to update feeds at POST.
  app.post '/listen/update', loadUser, (req, res) ->
    update_feeds_init()

  update_feeds_init = () ->
    to_update       = null
    req_build       = []
    existing_build  = []
    new_build       = []
    counter         = 0
    # Find all the feeds that belong to a user, loop through them.
    Feeds.find({'owner': harkUser.userID}).toArray (err, result) ->
      for k of result
        update_feed_request(result[k])

  update_feed_request = (to_update) ->
    # Request the URL.
    console.log 'We are updating ' + to_update.title
    request {uri: to_update.href}, (err, response, body) ->
      # Use XML2JS to parse it.
      parser.parseString body, (err, xml) ->
        if typeof(xml) is 'undefined'
          return

        feed = xml.channel

        for i in [0...500]
          # This catches to see if there is an array of items.
          if (typeof feed.item[_i] isnt "undefined") && (typeof feed.item[i].enclosure isnt "undefined")
            FeedCatches(feed.item[_i], req_build)

          # This catches to see if there is only one item.
          else if (typeof feed.item.title isnt "undefined")
            FeedCatches(feed.item, req_build)

        # Once we're done, we move on to the comparison function.
        update_feed_compare(to_update, req_build)

  update_feed_compare = (to_update, req_build) ->
    # Query our Feeds collection to find the feed that we are to update.
    Feeds.findOne { 'owner': harkUser.userID,'uuid': to_update.uuid }, (err, result) ->
      # Create a new array (existing_build) that we will compare with the requested array (req_build).
      existing_build = result.pods

      # Then we make the comparison.
      # Essentialy, this loops through both arrays and looks for items that appear in req_build but not existing_build.
      # It then pushes only the unique items (because they're new) to new_build.
      for k,v of req_build
        match = false
        for j,w of existing_build
          if v.podFile is w.podFile
            match = true
            break
        if match is false
          new_build.push req_build[k]

      counter++
      update_feed_finalize(to_update, new_build, existing_build, result)

  update_feed_finalize = (to_update, new_build, existing_build, result) ->
    # Now, we concatenate the new_build with the existing_build, so that we have one array with all items in their correct order.
    # Makes the DB update very, very clean and easy.
    final_build = new_build.concat existing_build

    console.log final_build
    console.log counter, result.length

    if (typeof new_build[0] isnt 'undefined') && (new_build[0] isnt null)
      # Feeds.findAndModify { 'owner': harkUser.userID, 'uuid': to_update.uuid }, [], { $set: { 'pods' : final_build } }, {new:true}, (err, result) ->
      console.log 'Feed successfully updated.'
    else
      return

    if counter is result.length
      console.log 'Time to update the view.'
      getFeeds harkUser.userID, (error, feed, podcastList) ->
        res.partial('listen/listen-main', { feeds: feed, podcasts: podcastList })