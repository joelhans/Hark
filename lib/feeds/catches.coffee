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