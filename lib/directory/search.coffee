module.exports = (app, express, loadUser, Directory, Feeds, moment, request, async, parser, ObjectID) ->

   app.post '/directory/search', loadUser, (req, res) ->
    string = req.body.string
    query = { title: new RegExp(string) }
    Directory.find( query ).sort( [['subscriptions','descending']] ).toArray (err, result) ->
      console.log result.title
      res.partial 'directory/directory-structure',
        locals:
          directory    : result
          user         : harkUser
          category     : 'all'
          playing      : harkUser.playing
          page         : false
          result_count : result.length