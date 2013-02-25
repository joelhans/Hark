module.exports = (app, express, loadUser, Directory, Feeds, moment, request, async, parser, ObjectID) ->

   app.post '/directory/search', loadUser, (req, res) ->
    string = req.body.string
    query = { title: new RegExp(string) }
    Directory.find( query, {pods: 0} ).sort( [['subscriptions','descending']] ).toArray (err, result) ->
      res.partial 'directory/directory-structure',
        locals:
          directory    : result
          user         : harkUser
          category     : 'all'
          playing      : harkUser.playing
          individual   : false
          page         : false
          final_page   : false
          result_count : result.length