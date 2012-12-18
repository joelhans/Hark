module.exports = (app, express, loadUser, Directory, Feeds, moment, request, async, parser, ObjectID) ->

  class get_feeds
    constructor: (@userID, @scope, @callback) ->

      if scope is 'all'
        Feeds.find( { 'owner': userID } ).toArray (err, feeds) ->
          feeds_loop(feeds)

      else
        Feeds.find( { 'owner': userID, 'uuid' : scope } ).toArray (err, feeds) ->
          feeds_loop(feeds)

      feeds_loop = (feeds) ->
        feed_list = []
        podcast_list = []

        # If the user has no feeds.
        if feeds is null
          callback null, [], []

        # Our main loop.
        async.forEachSeries feeds
          , (feed, callback) ->
            if feed.source is 'directory'

              Directory.findOne { 'uuid': feed.uuid }, (err, result) ->

                for podcast in feed.pods
                  if podcast.listened is 'false' && scope is 'all'
                    for odcast in result.pods
                      if odcast.podUUID is podcast.podUUID
                        pod_data = odcast
                        pod_data['listened'] = 'false'
                        pod_data['feedTitle'] = result.title
                        pod_data['feedUUID']  = result.uuid
                        podcast_list.push pod_data

                  else if scope isnt 'all'
                    for odcast in result.pods
                      if odcast.podUUID is podcast.podUUID
                        pod_data = odcast
                        pod_data['listened'] = podcast.listened
                        pod_data['feedTitle'] = result.title
                        pod_data['feedUUID']  = result.uuid
                        podcast_list.push pod_data

                callback()

            else if feed.source is 'owner' || typeof(feed.source) is 'undefined'

              for podcast in feed.pods
                if podcast.listened is 'false' && scope is 'all'
                  pod_data = podcast
                  pod_data['feedTitle'] = feed.title
                  pod_data['feedUUID']  = feed.uuid

                  if podcast.listened isnt 'true'
                    podcast_list.push pod_data

                else if scope isnt 'all'
                  pod_data = podcast
                  pod_data['feedTitle'] = feed.title
                  pod_data['feedUUID']  = feed.uuid
                  podcast_list.push pod_data

              callback()

          , () ->
            # Sort our podcast list by date.
            if typeof podcast_list[0] isnt "undefined"
              podcast_list.sort (a , b) ->
                if typeof(a['podDate']['_d']) is "object"
                  sort_a = moment(a['podDate']['_d']).valueOf()
                else 
                  sort_a = moment(a['podDate']).valueOf()

                if typeof(b['podDate']['_d']) is "object"
                  sort_b = moment(b['podDate']['_d']).valueOf()
                else
                  sort_b = moment(b['podDate']).valueOf()

                return sort_b - sort_a

            sidebar_loop(feed_list, podcast_list)

      sidebar_loop = (feed_list, podcast_list) ->
        Feeds.find( { 'owner': userID } ).toArray (err, feeds) ->
          async.forEachSeries feeds
          , (feed, callback) ->
            if feed.source is 'directory'

              Directory.findOne { 'uuid': feed.uuid }, (err, result) ->
                feed_data =
                  feedTitle : result.title
                  feeduuid  : result.uuid
                feed_list.push feed_data

                callback()

            else if feed.source is 'owner' || typeof(feed.source) is 'undefined'

              feed_data =
                feedTitle : feed.title
                feeduuid  : feed.uuid
              feed_list.push feed_data

              callback()
              
          , () ->

            # Sort our sidebar feeds alphabetically.
            feed_list.sort (a , b) ->
              if a['feedTitle'].toLowerCase() > b['feedTitle'].toLowerCase()
                return 1
              if a['feedTitle'].toLowerCase() < b['feedTitle'].toLowerCase()
                return -1
              return 0
            
            callback(null, feed_list, podcast_list)