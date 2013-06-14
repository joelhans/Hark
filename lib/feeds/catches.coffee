# http://stackoverflow.com/questions/9287510/multiple-files-communication-with-coffeescript
class exports.FeedCatches
  constructor: (@feed_type, @req_build) ->
    
    # req_build = []

    moment = require 'moment'

    # PUBDATE #
    if typeof(feed_type['pubDate']) is "string"
      pubDate = moment(feed_type['pubDate'], ["ddd\, DD MMM YYYY H:mm:ss Z"]).format()
    else if typeof(feed_type['dc:date']) is "string"
      pubDate = moment(feed_type['dc:date'], "YYYY-MM-DD\TH:mm:ssZ").format()
    # /PUBDATE #

    # DESCRIPTION #
    if typeof(feed_type.description) isnt "undefined" && typeof(feed_type.description) isnt "object"
      description = feed_type.description.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    else if typeof(feed_type['itunes:summary']) isnt "undefined" && typeof(feed_type['itunes:summary']) isnt "object"
      description = feed_type['itunes:summary'].replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    else
      description = 'No description available. Sorry.'
    # /DESCRIPTION #

    # MEDIA #
    if typeof(feed_type.enclosure[0]) isnt "undefined"
      podMedia = feed_type.enclosure[0]['@'].url
    else
      podMedia = feed_type.enclosure['@'].url
    # /MEDIA #

    podData =
      podTitle    : feed_type.title
      podLink     : feed_type.link
      podFile     : podMedia
      podDesc     : description
      podUUID     : Math.round((new Date().valueOf() * Math.random())) + ''
      podDate     : pubDate
      listened    : 'true'

    req_build.push podData

# REQUESTING
# This is a sanity check for incoming XML feeds. It performs a number of
# checks and handles errors as needed.
class exports.requesting
  constructor: (@to_update, @callback) ->

    request = require 'request'
    xml2js  = require 'xml2js'
    parser  = new xml2js.Parser()

    request {uri: to_update.href}, (err, response, body) ->

      # Unexpected error, hence the console.log.
      # This should not happen. One of the other errors should trigger instead.
      if err
        console.log err
        error = 'Failed to update this feed: ' + to_update.title
        callback(error, null)
        return

      # 500-level error codes.
      for code in [500, 501, 502, 503, 504]
        if response.statusCode is code
          error = 'Faulty feed: ' + to_update.title + '\n Failed to update this feed. Error: ' + response.statusCode
          callback(error, null)
          return

      # This will trigger if the page has been redirected to a 404 or an HTML page.
      if body.indexOf('<html') > -1
        error = 'Faulty feed: ' + to_update.title + '\n This feed is returning an HTML page, not an XML feed.'
        callback(error, null)
        return

      # Use XML2JS to parse the feed if there are no errors.
      parser.parseString body, (err, xml) ->

        # This checks for an xml element. If we got this far and this triggers, we're in "trouble."
        if typeof(xml) is 'undefined'
          error = 'Faulty feed. No XML element: ' + to_update.title
          callback(error, null)
          return

        feed = xml.channel
        req_build = []

        callback(null, feed, req_build)

# FEED CHECK
# This is a sanity check for feeds. We have to seaparate the feeds with a
# single item, those with an array of items, and the failures.
class exports.feed_check
  constructor: (@feed, @req_build, @callback) ->

    FeedCatches = require('./catches').FeedCatches

    # Check for a feed that has only a single item.
    if (typeof feed.item[1] is 'null')
      console.log 'Single listing.'
      console.log feed.item.title
      FeedCatches(feed.item, req_build)

    # Check to see if there is more than one item. If so, loop through the most recent 10.
    # This helps keep processing down, but users can miss podcasts if they update infrequently.
    else if (typeof feed.item[1] isnt 'undefined')
      for i in [0...20]
        if (typeof feed.item[i] isnt 'undefined') && (typeof feed.item[i].enclosure isnt 'undefined')
          FeedCatches(feed.item[i], req_build)

    # And if we can't find either an array of items or a single one, we bail.
    else
      error = 'Failed to update this feed at the request stage: ' + to_update.title
      callback(error, null)
      return

    callback(null, req_build)