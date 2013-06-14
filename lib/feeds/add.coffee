module.exports = (app, express, loadUser, Directory, Feeds, moment, request, async, parser, ObjectID) ->

  request = require('request')
  xml2js  = require('xml2js')
  moment  = require('moment')
  async   = require('async')
  url     = require('url')
  parser  = new xml2js.Parser()

  getFeeds    = require('./get_feeds')(app, express, loadUser, Directory, Feeds, moment, request, async, parser, ObjectID)
  FeedCatches = require('./catches').FeedCatches
  requesting  = require('./catches').requesting
  feed_check  = require('./catches').feed_check

  app.post '/listen/add', loadUser, (req, res) ->

    # Test to make sure that user is inputting either an http: or https: URL.
    parsedURL = url.parse(req.body.url)
    if parsedURL.protocol isnt 'http:' and parsedURL.protocol isnt 'https:'
      res.status(500)
      req.session.messages = 'The feed must begin with http: or https:. Please check the feed you\'re trying to input and try again.'
      res.render 'layout/modal',
        messages : req.session.messages
      return

    Feeds.findOne { 'owner': harkUser.userID, 'href': req.body.url }, (err, result) ->

      if result isnt null
        res.status(500)
        req.session.messages = 'You already added that feed!'
        res.render 'layout/modal',
          messages : req.session.messages
        return

      else

        to_update = []
        to_update.href = req.body.url

        requesting to_update, (error, feed, req_build) ->

          if error?
            console.log error
            res.status(500)
            req.session.messages = 'An error occurred with that feed. Maybe the site is down?'
            res.render 'layout/modal',
              messages : req.session.messages
            return

          feed_check feed, req_build, (error, req_build) ->

            if error?
              console.log error
              res.status(500)
              req.session.messages = 'An error occurred with that feed. Maybe the site is down?'
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
              getFeeds harkUser.userID, 'all', (error, feeds, podcasts) ->
                res.render 'listen/listen-structure',
                  user     : harkUser
                  feeds    : feeds
                  podcasts : podcasts
                  playing  : harkUser.playing
                  playlist : harkUser.playlist