#######################################
# ADD TO PLAYLIST
#######################################

$(document)
  .on 'click', '.playlist-add', (e) ->
    e.preventDefault()
    playlist_data = []
    
    playlist_data =
      podcast      : $(this).attr('data-file')
      podcastTitle : $(this).attr('data-title')
      podcastID    : $(this).attr('data-uuid')
      feedUUID     : $(this).attr('data-feedUUID')
      feedTitle    : $(this).attr('data-feed')

    $.ajax
      type    : 'POST'
      url     : '/listen/playlist/add/'
      data    : playlist_data
      error   : (err) ->
        $('#modal').html(err.responseText)
        $('#modal').fadeIn(500)
      success : (data) ->
        $('.playlist').html(data)

#######################################
# CLEAR PLAYLIST
#######################################

$(document)
  .on 'click', '.playlist-drop', (e) ->
    e.preventDefault()
    drop_data = []

    drop_data =
      podcast : $(this).attr('data-file')

    $.ajax
      type    : 'POST'
      url     : '/listen/playlist/drop/'
      data    : drop_data
      error   : (err) ->
        $('#modal').html(err.responseText)
        $('#modal').fadeIn(500)
      success : (data) ->
        $('.playlist').html(data)

#######################################
# CLEAR PLAYLIST
#######################################

$(document)
  .on 'click', '.playlist-clear', (e) ->
    e.preventDefault()
    $.ajax
      type    : 'POST'
      url     : '/listen/playlist/clear/'
      error   : (err) ->
        $('#modal').html(err.responseText)
        $('#modal').fadeIn(500)
      success : (data) ->
        $('.playlist').html(data)