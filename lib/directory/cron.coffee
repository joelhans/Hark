module.exports = (app, express, loadUser, Directory, Feeds, moment, request, async, parser, ObjectID) ->

  FeedCatches = require('../feeds/catches').FeedCatches
  requesting  = require('../feeds/catches').requesting
  feed_check  = require('../feeds/catches').feed_check

  cronJob = require('cron').CronJob

  to_update       = null
  req_build       = []
  existing_build  = []
  new_build       = []

  # Run this cron job every 60 seconds.
  new cronJob('*/60 * * * * *', () ->
    update_directory_init()
  , null, true, null)

  update_directory_init = () ->
    to_update       = null
    req_build       = []
    existing_build  = []
    new_build       = []

    Directory.find().sort({ lastUpdated: 1 }).limit(1).toArray (err, result) ->
      # This attempts to "throttle" requests until it finds a podcast that has not been updated in more than a day.
      for k,v of result
        if moment().diff(v.lastUpdated) > 86400000
          update_directory_request(result[k])
          break

  update_directory_request = (to_update) ->

    requesting to_update, (error, feed, req_build) ->

      if error?
        console.log error
        update_directory_finalize(to_update, new_build, existing_build)

      feed_check feed, req_build, (error, req_build) ->

        # Once we're done, we move on to the comparison function.
        update_directory_compare(to_update, req_build)

  update_directory_compare = (to_update, req_build) ->    
    # Query our Directory database to find the feed that we are to update.
    Directory.findOne {'uuid': to_update.uuid}, (err, result) ->
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

      update_directory_finalize(to_update, new_build, existing_build)

  update_directory_finalize = (to_update, new_build, existing_build) ->
    # Now, we concatenate the new_build with the existing_build, so that we have one array with all items in their correct order.
    # Makes the DB update very, very clean and easy.
    final_build = new_build.concat existing_build

    if (typeof new_build[0] isnt 'undefined') && (new_build[0] isnt null)
      Directory.findAndModify { 'uuid': to_update.uuid }, [], { $set: { 'pods' : final_build, 'lastUpdated' : moment().format(), 'lastPodcast' : new_build[0].podDate } }, {new:true}, (err, result) ->
        console.log 'Directory feed -- ' + to_update.title + ' -- successfully updated.'
    else
      Directory.findAndModify { 'uuid': to_update.uuid }, [], { $set: { 'lastUpdated' : moment().format() } }, {new:true}, (err, result) ->
        console.log 'Directory feed -- ' + to_update.title + ' -- not updated.'
