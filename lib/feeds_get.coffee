class exports.FeedGet
  constructor: (@feed_type, @callback) ->

    Feeds.find({'owner': harkUser.userID}).toArray (err, result) ->
      if err
        throw err

      if typeof results[0] is "undefined" or typeof results[0] is "null"
        callback(null, [], [])

      