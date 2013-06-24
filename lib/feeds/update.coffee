module.exports = (app, express, loadUser, Directory, Feeds, moment, request, async, parser, ObjectID) ->

  getFeeds    = require('./get_feeds')(app, express, loadUser, Directory, Feeds, moment, request, async, parser, ObjectID)
  FeedCatches = require('./catches').FeedCatches
  requesting  = require('./catches').requesting
  feed_check  = require('./catches').feed_check

  to_update       = null
  total           = null
  req_build       = []
  existing_build  = []
  new_build       = []
  owner_build     = []
  counter         = 0

  # Run the first function to update feeds at POST.
  app.post '/listen/update', loadUser, (req, res) ->
    counter         = 0
    update_feeds_init(res)

  update_feeds_init = (res) ->    
    # Find all the feeds that belong to a user, loop through them.
    Feeds.find({'owner': harkUser.userID}).toArray (err, result) ->
      req_build       = []
      existing_build  = []
      new_build       = []
      owner_build     = []
      total           = result.length

      for k of result
        update_feed_sift(res, result[k], total)

  # We need to check whether it's a owner or a directory feed.
  # If it's an owner feed, the existing "should" work.
  # If it's a directory feed, we'll update that, then pull the new data into the Feeds version.
  update_feed_sift = (res, to_update, total) ->
    req_build       = []
    existing_build  = []
    new_build       = []
    owner_build     = []
    if to_update.source is 'directory'
      dir_feed_request(res, to_update, total)
    else if to_update.source is 'owner' || typeof(to_update.source) is 'undefined'
      update_feed_request(res, to_update, total)

  #
  # UPDATING USER-OWNED FEED
  #

  update_feed_request = (res, to_update, total) ->

    requesting to_update, (error, feed, req_build) ->

      if error?
        console.log error
        counter++
        update_feed_finalize(res, to_update, total, new_build, existing_build, counter)
        return

      feed_check feed, req_build, (error, req_build) ->

        if error?
          console.log error
          counter++
          update_feed_finalize(res, to_update, total, new_build, existing_build, counter)
          return

        # Once we're done, we move on to the comparison function.
        update_feed_compare(res, to_update, total, req_build)

  update_feed_compare = (res, to_update, total, req_build) ->
    # Query our Feeds collection to find the feed that we are to update.
    # Create a new array (existing_build) that we will compare with the requested array (req_build).
    existing_build  = []
    new_build       = []
    existing_build = to_update.pods

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
        req_build[k].listened = 'false'
        new_build.push req_build[k]

    counter++
    update_feed_finalize(res, to_update, total, new_build, existing_build, counter)

  update_feed_finalize = (res, to_update, total, new_build, existing_build, counter) ->
    # Now, we concatenate the new_build with the existing_build, so that we have one array with all items in their correct order.
    # Makes the DB update very, very clean and easy.

    final_build = new_build.concat existing_build

    if (typeof new_build[0] isnt 'undefined') && (new_build[0] isnt null)
      Feeds.findAndModify { 'owner': harkUser.userID, 'uuid': to_update.uuid }, [], { $set: { 'pods' : final_build } }, {new:true}, (err, result) ->
    
    if counter is total
      getFeeds harkUser.userID, 'all', (error, feeds, podcasts) ->
        res.render 'listen/listen-structure', 
          user     : harkUser
          feeds    : feeds
          podcasts : podcasts
          playing  : harkUser.playing
          playlist : harkUser.playlist

  #
  # UPDATING DIRECTORY-BASED FEED
  #

  dir_feed_request = (res, to_update, total) ->
    Directory.findOne { 'uuid': to_update.uuid }, (err, result) ->

      requesting result, (error, feed, req_build) ->

        if error?
          console.log error
          counter++
          dir_feed_finalize(res, to_update, total, new_build, existing_build, counter)
          return

        feed_check feed, req_build, (error, req_build) ->

          if error?
            console.log error
            counter++
            dir_feed_finalize(res, to_update, total, new_build, existing_build, counter)
            return

          # Once we're done, we move on to the comparison function.
          dir_feed_compare(res, to_update, total, result, req_build)

  dir_feed_compare = (res, to_update, total, result, req_build) ->
    existing_build  = []
    new_build       = []
    existing_build  = result.pods

    for k,v of req_build
      match = false
      for j,w of existing_build
        if v.podFile is w.podFile
          match = true
          break
      if match is false
        req_build[k].listened = 'false'
        new_build.push req_build[k]

    counter++
    dir_feed_finalize(res, to_update, total, result, req_build, new_build, existing_build)

  dir_feed_finalize = (res, to_update, total, result, req_build, new_build, existing_build) ->
    owner_build = []
    final_build = []
    final_build = new_build.concat existing_build

    if (typeof new_build[0] isnt 'undefined') && (new_build[0] isnt null)
      Directory.findAndModify { 'uuid': to_update.uuid }, [], { $set: { 'pods' : final_build, 'lastUpdated' : moment().format(), 'lastPodcast' : new_build[0].podDate } }, {new:true}, (err, result) ->

    for k,v of final_build
      match = false
      for j,w of to_update.pods
        if v.podUUID is w.podUUID
          match = true
          break
      if match is false
        owner_build_pod = 
          listened : 'false'
          podUUID  : final_build[k].podUUID
        owner_build.push owner_build_pod

    final_build = owner_build.concat to_update.pods

    if (typeof final_build[0] isnt 'undefined') && (final_build[0] isnt null)
      Feeds.findAndModify { 'owner': harkUser.userID, 'uuid': to_update.uuid }, [], { $set: { 'pods' : final_build } }, {new:true}, (err, result) ->

    if counter is total
      getFeeds harkUser.userID, 'all', (error, feeds, podcasts) ->
        res.render 'listen/listen-structure', 
          user     : harkUser
          feeds    : feeds
          podcasts : podcasts
          playing  : harkUser.playing
          playlist : harkUser.playlist