window.mediaData = progress = null
mediaData = window.mediaData

######################################
# AUDIO PLAYER
######################################

window.jplayer_1 = () ->
  $('#jquery_jplayer_1').jPlayer
    swfPath: "/js"
    supplied: 'mp3'
    solution: 'html, flash'
    errorAlerts: false
    volume: 0.5
    play: (d) ->
      updatePlaying = setInterval (-> 
        window.updateStatus()
      ), 120000
    timeupdate: (d) ->
      progress = d.jPlayer.status.currentTime
      window.playStatus(progress, window.mediaData)
    pause: (d) ->
      clearInterval(window.updatePlaying)
    ended: (d) ->
      clearInterval(window.updatePlaying)
      $('[data-uuid="' + window.mediaData.podcastID + '"]')
        .animate
          opacity: '0',
          600
        .animate
          height          : '0px'
          'margin-bottom' : '0px',
          600,
          () ->
            $(this).remove()
            $('.jp-playing').fadeOut(300).html('')
      $.ajax
        type: 'POST'
        url: '/listen/' + window.mediaData.feedUUID + '/listened/' + window.mediaData.podcastID
        success: () ->
          console.log 'jPlayer ended.'
        error: () ->
          console.log 'jPlayer had an error.'
      ##
      # PLAYLIST
      ##
      if $('.playlist-item').length
        window.playlistInc()
    error: (d) ->
      console.log 'ERROR:'
      console.log d
    ready: (d) ->
      if typeof(playing) isnt 'undefined' and playing.podcast.indexOf('mp3') isnt -1
        $('.podcast-player').css({'width': '100%'})
        window.mediaData = playing
        window.playStatus(playing.progress, playing)
        $('#jquery_jplayer_1').jPlayer("setMedia", {
            mp3: playing.podcast
         }).jPlayer('pause', Math.round(playing.progress))

######################################
# VIDEO PLAYER
######################################

window.jplayer_2 = () ->
  $('#jquery_jplayer_2').jPlayer
    swfPath             : "/js/"
    supplied            : 'm4v, m4a'
    solution            : 'flash, html'
    errorAlerts         : false
    cssSelectorAncestor : "#jp_container_2"
    volume              : 0.5
    play                : (d) ->
      if !$('.video-player').hasClass('video-moved')
        $('.video-player').css('top': $(document).height() - $('.video-player').height() - 128)
      updatePlaying = setInterval (-> 
        window.updateStatus()
      ), 120000
    timeupdate          : (d) ->
      progress = d.jPlayer.status.currentTime
      window.playStatus(progress, window.mediaData)
    pause: (d) ->
      clearInterval(window.updatePlaying)
    ended: (d) ->
      clearInterval(window.updatePlaying)
      $('.video-player, #jquery_jplayer_2').fadeOut(300)
      $('[data-uuid="' + window.mediaData.podcastID + '"]')
        .animate
          opacity: '0',
          600
        .animate
          height          : '0px'
          'margin-bottom' : '0px',
          600,
          () ->
            $(this).remove()
            $('.jp-playing').fadeOut(300).html('')
      $.ajax
        type: 'POST'
        url: '/listen/' + window.mediaData.feedUUID + '/listened/' + window.mediaData.podcastID
        success: () ->
          console.log 'jPlayer ended.'
        error: () ->
          console.log 'jPlayer had an error.'
      ##
      # PLAYLIST
      ##
      if $('.playlist-item').length
        window.playlistInc()
    error: (d) ->
      console.log 'ERROR'
      console.log d
      console.log d.jPlayer.error
    ready: (d) ->
      if typeof(playing) isnt 'undefined' and playing.podcast.indexOf('mp4') isnt -1
        $('.podcast-player').css({'width': '0px'})
        $('.video-podcast-player').css({'width': '100%'})
        $('.video-player, #jquery_jplayer_2, .jp-playing').show()
        $('.video-player').css({'top': '40%'})
        window.mediaData = playing
        window.playStatus(playing.progress, playing)
        $('#jquery_jplayer_2').jPlayer("setMedia", {
            m4v: playing.podcast
          }).jPlayer('pause', Math.round(playing.progress))

######################################
# UPDATE PLAYSTATUS IN SESSIONSTORAGE
######################################

window.playStatus = (progress, mediaData) ->
  sessionStorage.setItem("podcast", window.mediaData.podcast)
  sessionStorage.setItem("podcastID", window.mediaData.podcastID)
  sessionStorage.setItem("feedUUID", window.mediaData.feedUUID)
  sessionStorage.setItem("feedTitle", window.mediaData.feedTitle)
  sessionStorage.setItem("podcastTitle", window.mediaData.podcastTitle)
  sessionStorage.setItem("progress", progress)

######################################
# SYNC PLAYSTATUS
######################################

window.updateStatus = () ->
  playing =
    "podcast"      : sessionStorage.getItem("podcast")
    "podcastID"    : sessionStorage.getItem("podcastID")
    "podcastTitle" : sessionStorage.getItem("podcastTitle")
    "feedTitle"    : sessionStorage.getItem("feedTitle")
    "feedUUID"     : sessionStorage.getItem("feedUUID")
    "progress"     : sessionStorage.getItem("progress")

  $.ajax
    type    : 'POST'
    url     : '/listen/playing'
    data    : playing
    success : (data) ->
      console.log('Sync-ed! ' + data)
    error   : (data) ->
      console.log('Error with syncing! ' + data)
      return

######################################
# INCREMENT PLAYLIST
######################################

window.playlistInc = () ->
  window.mediaData =
    podcast      : $('.playlist-item').eq(0).attr('data-file')
    podcastTitle : $('.playlist-item').eq(0).attr('data-title')
    podcastID    : $('.playlist-item').eq(0).attr('data-uuid')
    feedUUID     : $('.playlist-item').eq(0).attr('data-feedUUID')
    feedTitle    : $('.playlist-item').eq(0).attr('data-feed')

  if window.mediaData.podcast.indexOf('mp4') is -1
    $('#jquery_jplayer_1').jPlayer("pauseOthers").jPlayer("setMedia", {
      mp3: window.mediaData.podcast
    }).jPlayer('play')
  else 
    $('#jquery_jplayer_2').jPlayer("pauseOthers").jPlayer("setMedia", {
      m4v: window.mediaData.podcast
    }).jPlayer('play')

  $.ajax
    type    : 'POST'
    url     : '/listen/' + window.mediaData.feedUUID + '/' + window.mediaData.podcastID
    data    : window.mediaData
    error: (data) ->
      console.log data
    success : (data) ->
      $('.current-feed').text(window.mediaData.feedTitle)
      $('.currently-playing li:last-of-type p').text(window.mediaData.podcastTitle)
      $('.playlist-item')[0].remove()
      $.ajax
        type    : 'POST'
        url     : '/listen/playlist/drop/'
        data    : window.mediaData
        error   : (err) ->
          $('#modal').html(err.responseText)
          $('#modal').fadeIn(500)
        success : (data) ->
          $('.playlist').html(data)

######################################
# OTHER JPLAYER FUNCTIONS
######################################

window.jplayer = () ->

  #------------------------------
  # Manual sync button
  #------------------------------
  $('.manual-sync').click (e) ->
    if $('#jquery_jplayer_1').data().jPlayer.status.paused is false
      progress = $('#jquery_jplayer_1').data("jPlayer").status.currentTime
    else if $('#jquery_jplayer_2').data().jPlayer.status.paused is false
      progress = $('#jquery_jplayer_2').data("jPlayer").status.currentTime
    else
      console.log 'WTF'
    console.log progress, window.mediaData
    window.playStatus(progress, window.mediaData)
    window.updateStatus()

  # ------------------------------
  # Move video player
  # ------------------------------

  $('body')
    .delegate '.video-move', 'mousedown', (e) ->
      $(window).bind 'mousemove', (e) ->
        e.preventDefault()
        $('.video-player').removeClass('minimized')
        $('.video-player').addClass('video-moved').css({'top': e.clientY - 20, 'left': e.clientX - 12, 'margin-left': ''})
    .delegate '.video-move', 'mouseup', (e) ->
      $('.video-move').undelegate()
      $(window).unbind 'mousemove'

  # ------------------------------
  # Resize video player
  # ------------------------------

  $(document)
    .on 'mousedown', '.video-resize', (e) ->
      i_f = $('.video-player').offset().top + $('.video-player').height()
      $(window).bind 'mousemove', (e) ->
        e.preventDefault()
        $('.video-player').css
          'top'         : e.clientY - 12
          'width'       : e.clientX - $('.video-player').offset().left + 12
          'height'      : i_f - $('.video-player').offset().top + 12
          'padding-bottom' : 4
        $('#jquery_jplayer_2, #jp_video_1').css
          'height'      : '100%'
          'width'       : '100%'
      $('*').onselectstart
    .on 'mouseup', (e) ->
      $('.video-resize').off
      $(window).unbind 'mousemove'
