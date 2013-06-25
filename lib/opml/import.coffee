module.exports = (app, express, loadUser, Directory, Feeds, moment, request, async, parser, ObjectID) ->

  fs      = require('fs')
  request = require('request')
  xml2js  = require('xml2js')
  moment  = require('moment')
  async   = require('async')
  url     = require('url')
  parser  = new xml2js.Parser()
  
  opml        = require('opmlparser')
  opml_parser = new opml()

  getFeeds    = require('../feeds/get_feeds')(app, express, loadUser, Directory, Feeds, moment, request, async, parser, ObjectID)
  FeedCatches = require('../feeds/catches').FeedCatches
  requesting  = require('../feeds/catches').requesting
  feed_check  = require('../feeds/catches').feed_check

  app.post '/opml/import', loadUser, (req, res) ->
    opml_items = [] 

    # Read the file from the server's tmp directory, then parse it.
    fs.readFile req.files.opml.path, (err, file) ->
      parser.parseString file, (err, xml) ->

        # Loop through the OPML file, extract the RSS urls.
        for i in [0...xml.body.outline.length]
          outline = xml.body.outline[i] 
         
          if typeof outline['@'].type is 'undefined'
            for j in [0...outline.outline.length]
              opml_items.push outline.outline[j]['@'].xmlUrl
          else
            opml_items.push outline['@'].xmlUrl

        # Loop through the opml_items array, request each.
        for opml in opml_items
          to_update = []
          to_update.href = opml

          requesting to_update, (error, feed, req_build) ->

            if error?
              console.log error
              res.status(500)
              req.session.messages = 'An error occurred with one of those feeds.'
              res.render 'layout/modal',
                messages : req.session.messages
              return

            feed_check feed, req_build, (error, req_build) ->

              if error?
                console.log error
                res.status(500)
                req.session.messages = 'An error occured with one of those feeds.'
                res.render 'layout/modal',
                  messages : req.session.messages
                return

              req_build[0].listened = 'false'

              feedData =
                title       : feed.title
                href        : req.body.url
                description : feed.description
                pods        : req_build
                uuid        : Math.round((new Date().valueOf() * Math.random())) + ''
                owner       : harkUser.userID
                source      : 'owner'

              Feeds.insert feedData, {safe: true}, (err, result) ->
                if _i is opml_items.length
                  console.log 'Done importing.'
                  getFeeds harkUser.userID, 'all', (error, feeds, podcasts) ->
                    res.render 'listen',
                      user     : harkUser
                      feeds    : feeds
                      podcasts : podcasts
                      playing  : harkUser.playing
                      playlist : harkUser.playlist


  app.get '/opml/export', loadUser, (req, res) ->

