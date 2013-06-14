# ------------------------------
# Title
# ------------------------------

window.listen_title = () ->
  if typeof $('.list-single').attr('data-title') isnt 'undefined'
    title = $('.list-single').attr('data-title')
    document.title = 'Hark | ' + title

# ------------------------------
# Add a feed
# ------------------------------

$(document)
  .delegate '.act-add', 'click', (e) ->
    e.preventDefault()
    $('.add-feed').toggle()

$('.add-feed').live 'keypress', (e) ->
  if e.which is 13
    data =
      url: $(e.currentTarget).val()
    $.ajax
      type:    'POST'
      url:     '/listen/add'
      data:    data
      error: (err) ->
        $('#modal').html(err.responseText)
        $('#modal').fadeIn(500)
      success: (data) ->
        $('.hark-container').html(data)
        $('.add-feed').val('')
        $('.add-feed').hide()
        window.ajaxHelpers()

# ------------------------------
# Update feeds
# ------------------------------

$(document)
  .delegate '.act-update', 'click', (e) ->
    e.preventDefault()
    $('.act-update a').text 'Updating...'
    $.ajax
      type: 'POST'
      url: '/listen/update'
      error: (err) ->
        $('#modal').html(err.responseText)
        $('#modal').fadeIn(500)
      success: (data) ->
        $('.act-update a').text 'Update'
        $('.hark-container').html(data)
        window.ajaxHelpers()

# ------------------------------
# Go back to all feeds
# ------------------------------

$(document)
  .delegate '.allFeeds a', 'click', (e) ->
    # History.pushState {}, "Hark | Your podcasts", $(e.currentTarget).attr 'href'
    e.preventDefault()
    $.ajax
      type    : 'POST'
      url     : '/listen/podcast/all'
      success : (data) ->
        $('.primary').html(data)
        window.ajaxHelpers()

# ------------------------------
# Load a single feed
# ------------------------------

# $(document)
#   .delegate '.loadFeed, .loadFeedFromItem', 'click', (e) ->
#     # History.pushState {}, "Hark | " + $('.loadFeed').text(), $(e.currentTarget).attr 'href'
#     e.preventDefault()
#     data =
#       feedID : $(this).attr('href').split('/')[3]
#     $.ajax
#       type:    'POST'
#       data:    data
#       url:     '/listen/podcast/' + data.feedID
#       success: (data) ->
#         $('.primary').html(data)
#         window.ajaxHelpers()

# ------------------------------
# Sidebar feed actions
# ------------------------------

# Expand/collapse the edit/remove menu

$(document)
  .delegate '.sidebar-expander', 'click', (e) ->
    if $(e.currentTarget).is('.expanded')
      # $(e.currentTarget).parent().animate({height: '46px'}, 300)
      # $('.hover-er').animate({height: '46px'}, 80)
      $(e.currentTarget).next().removeClass('undocked').fadeOut(300)
      $(e.currentTarget).parent().removeClass('active')
      $(e.currentTarget).removeClass('expanded')
    else
      $('.sidebar-action-edit-input').hide()
      # $(e.currentTarget).parent().animate({height: '112px'}, 300).css('overflow', 'visible');
      $(e.currentTarget).parent().css('overflow', 'visible');
      # $('.hover-er').animate({height: '102px'}, 80)
      $(e.currentTarget).next().addClass('undocked').fadeIn(300)
      $(e.currentTarget).parent().addClass('active')
      $(e.currentTarget).addClass('expanded')

# Edit feed

$(document)
  .delegate '.sidebar-action-edit', 'click', (e) ->
    e.preventDefault()
    $('.sidebar-action-edit-input').val('')
    $('.sidebar-action-edit-input').fadeIn(300)
    $('.sidebar-action-edit-input').val($(e.currentTarget).parent().siblings('.loadFeed').text())

$('.sidebar-action-edit-input')
  .live 'keypress', (e) ->
    if e.which is 13
      data =
        feedID:   $(this).prev().attr('href').split('/')[3]
        feedName: $(this).val()
      console.log data
      $.ajax
        type:    'POST'
        data:    data
        url:     '/listen/edit/' + data.feedID
        success: (data) ->
          $('.hark-container').html(data)
          window.ajaxHelpers()


# Remove feed

$(document)
  .delegate '.unsubscribe', 'click', (e) ->
    e.preventDefault()
    data =
      feedID: $(e.currentTarget).attr('href').split('/')[3]
    $.ajax
      type:    'POST'
      data:    data
      url:     '/listen/remove/' + data.feedID
      error: (err) ->
        $('#modal').html(err.responseText)
        $('#modal').fadeIn(500)
      success: (data) ->
        $('.hark-container').html(data)
        window.ajaxHelpers()

# ------------------------------
# Podcast actions
# ------------------------------

# Select a podcast

$(document)
  .delegate '.podcast-item:not(.selected)', 'click', (e) ->
    # $('.selected').children('.podcastDescription').fadeOut(500)
    $('.podcast-item').removeClass('selected')
    $(e.currentTarget).addClass('selected')
    $('.act-listen, .act-mark, .act-read, .act-source, .act-download').removeClass('inactive').addClass('active')

# De-select a podcast

$(document)
  .delegate '.selected', 'click', (e) ->
    # $('.selected').children('.podcastDescription').fadeOut(500)
    $(e.currentTarget).removeClass('selected')
    $('.act-listen, .act-mark, .act-read, .act-source, .act-download').removeClass('active').addClass('inactive')

# Listen to a podcast

$(document)
  .delegate '.act-listen.active', 'click', (e) ->
    window.mediaData =
      podcast      : $('.selected').attr('data-file')
      podcastTitle : $('.selected').attr('data-title')
      podcastID    : $('.selected').attr('data-uuid')
      feedUUID     : $('.selected').attr('data-feedUUID')
      feedTitle    : $('.selected').attr('data-feed')

    if window.mediaData.podcast.indexOf('mp4') is -1
      $('.podcast-player').css({'width': '100%'})
      $('.video-podcast-player').css({'width': '0px'})
      $('.video-player, #jquery_jplayer_2, .jp-playing').hide()
      $('#jquery_jplayer_1').jPlayer("pauseOthers").jPlayer("setMedia", {
        mp3: window.mediaData.podcast
      }).jPlayer('play')
    else
      $('.podcast-player').css({'width': '0px'})
      $('.video-podcast-player').css({'width': '100%'})
      $('.video-player, #jquery_jplayer_2, .jp-playing').show()
      $('#jquery_jplayer_2').jPlayer("pauseOthers").jPlayer("setMedia", {
        m4v: window.mediaData.podcast
      }).jPlayer('play')

    $.ajax
      type    : 'POST'
      url     : '/listen/listen/' + window.mediaData.feedUUID + '/' + window.mediaData.podcastID
      data    : window.mediaData
      error: (data) ->
        console.log data
      success : (data) ->
        $('.current-feed').text(window.mediaData.feedTitle)
        $('.currently-playing li:last-of-type p').text(window.mediaData.podcastTitle)

$(document)
  .delegate '.podcastListen', 'click', (e) ->
    e.preventDefault()
    window.mediaData =
      podcast      : $(this).attr('data-file')
      podcastTitle : $(this).attr('data-title')
      podcastID    : $(this).attr('href').split('/')[3]
      feedUUID     : $(this).attr('href').split('/')[2]
      feedTitle    : $(this).attr('data-feed')

    if window.mediaData.podcast.indexOf('mp4') is -1
      $('.podcast-player').css({'width': '100%'})
      $('.video-podcast-player').css({'width': '0px'})
      $('.video-player, #jquery_jplayer_2, .jp-playing').hide()
      $('#jquery_jplayer_1').jPlayer("pauseOthers").jPlayer("setMedia", {
        mp3: window.mediaData.podcast
      }).jPlayer('play')
    else
      $('.podcast-player').css({'width': '0px'})
      $('.video-podcast-player').css({'width': '100%'})
      $('.video-player, #jquery_jplayer_2, .jp-playing').show()
      $('#jquery_jplayer_2').jPlayer("pauseOthers").jPlayer("setMedia", {
        m4v: window.mediaData.podcast
      }).jPlayer('play')

    $.ajax
      type    : 'POST'
      url     : '/listen/listen/' + window.mediaData.feedUUID + '/' + window.mediaData.podcastID
      data    : window.mediaData
      error: (data) ->
        console.log data
      success : (data) ->
        $('.current-feed').text(window.mediaData.feedTitle)
        $('.currently-playing li:last-of-type p').text(window.mediaData.podcastTitle)

# Mark a podcast as "listened."

$(document)
  .delegate '.act-mark.active', 'click', (e) ->
    e.preventDefault()
    split = $('.selected').attr('class').split(/\s+/)
    delegator = split[1]
    data =
      id   : $('.selected').attr('data-uuid')
      feed : $('.selected').attr('data-feedUUID')

    if delegator is 'all'
      $('.selected')
        .animate
          opacity: '0',
          600
        .animate
          height          : '0px'
          'margin-bottom' : '0px',
          600,
          () ->
            $(this).remove()
      $.ajax
        type : 'POST'
        url  : '/listen/listened/' + data.feed + data.id
        data : data
        success: (data) ->
          console.log data
        error: (data) ->
          console.log data
    else if delegator is 'single'
      $('#' + data.id).removeClass('false')
      $.ajax
        type : 'POST'
        url  : '/listen/listened/' + data.feed + data.id
        data : data
        success: (data) ->
          console.log data
        error: (data) ->
          console.log data
    else
      console.log 'Darn.'

# Read a description

$(document)
  .delegate '.act-read.active', 'click', (e) ->
    $('.selected').children('.podcastDescription').toggle(500)
      # window.ajaxHelpers()
    return false

$(document)
  .delegate '.item-actions-read', 'click', (e) ->
    $(e.currentTarget).parent().parent().children('.podcastDescription').toggle(500)

# Go through to external link

$(document)
  .delegate '.act-source.active', 'click', (e) ->
    window.open($('.selected').attr('data-source'), '_newtab')

# Download podcast

$(document)
  .delegate '.act-download.active', 'click', (e) ->
    window.open($('.selected').attr('data-file'), '_newtab')

# ------------------------------
# Sorting
# ------------------------------

$(document)
  .delegate '.act-sorting', 'click', (e) ->
    $('.act-sorting ul').toggle()

# By feed title

$(document)
  .delegate '.sort-feed', 'click', (e) ->
    feedSortMe = []

    $('.podcast-item').each (e) ->
      sortData = 
        uuid: $(this).attr('data-uuid'),
        feedTitle: $(this).attr('data-feed')
      feedSortMe.push(sortData)

    if $('.sort-feed').hasClass('descending') is not true
      feedSortMe.sort (a,b) ->
        if (a['feedTitle'].toLowerCase() > b['feedTitle'].toLowerCase())
          return 1
        else if (a['feedTitle'].toLowerCase() < b['feedTitle'].toLowerCase())
          return -1
        return 0
      $('.sort-feed').addClass('descending')
      $('.sort-title i, .sort-date i').removeClass('icon-chevron-down icon-chevron-up')
      $('.sort-feed i').removeClass('icon-chevron-up').addClass('icon-chevron-down')
    else
      feedSortMe.sort (a,b) ->
        if (a['feedTitle'].toLowerCase() < b['feedTitle'].toLowerCase())
          return 1
        else if (a['feedTitle'].toLowerCase() > b['feedTitle'].toLowerCase())
          return -1
        return 0
      $('.sort-feed').removeClass('descending').addClass('ascending')
      $('.sort-title i, .sort-date i').removeClass('icon-chevron-down icon-chevron-up')
      $('.sort-feed i').removeClass('icon-chevron-down').addClass('icon-chevron-up')

    $.each feedSortMe, () ->
      $('.podcastList').append($('[data-uuid="' + this.uuid + '"]'))

# By podcast title

$(document)
  .delegate '.sort-title', 'click', (e) ->
    feedSortMe = []

    $('.podcast-item').each (e) ->
      sortData = 
        uuid: $(this).attr('data-uuid'),
        podcastTitle: $(this).attr('data-title')
      feedSortMe.push(sortData)

    if $('.sort-title').hasClass('descending') is not true
      feedSortMe.sort (a,b) ->
        if (a['podcastTitle'].toLowerCase() > b['podcastTitle'].toLowerCase())
          return 1
        else if (a['podcastTitle'].toLowerCase() < b['podcastTitle'].toLowerCase())
          return -1
        return 0
      $('.sort-title').addClass('descending')
      $('.sort-feed i, .sort-date i').removeClass('icon-chevron-down icon-chevron-up')
      $('.sort-title i').removeClass('icon-chevron-up').addClass('icon-chevron-down')
    else
      feedSortMe.sort (a,b) ->
        if (a['podcastTitle'].toLowerCase() < b['podcastTitle'].toLowerCase())
          return 1
        else if (a['podcastTitle'].toLowerCase() > b['podcastTitle'].toLowerCase())
          return -1
        return 0
      $('.sort-title').removeClass('descending').addClass('ascending')
      $('.sort-feed i, .sort-date i').removeClass('icon-chevron-down icon-chevron-up')
      $('.sort-title i').removeClass('icon-chevron-down').addClass('icon-chevron-up')

    $.each feedSortMe, () ->
      $('.podcastList').append($('[data-uuid="' + this.uuid + '"]'))

# By date

$(document)
  .delegate '.sort-date', 'click', (e) ->
    feedSortMe = []

    $('.podcast-item').each (e) ->
      sortData = 
        uuid: $(this).attr('data-uuid'),
        date: $(this).children('.podcast-feed').children('.moment').attr('data-date')
      feedSortMe.push(sortData)

    if $('.sort-date').hasClass('descending') is not true
      feedSortMe.sort (a,b) ->
        if (moment(a['date']) < moment(b['date']))
          return 1
        if (moment(a['date']) > moment(b['date']))
          return -1
        return 0
      $('.sort-date').addClass('descending')
      $('.sort-title i, .sort-feed i').removeClass('icon-chevron-down icon-chevron-up')
      $('.sort-date i').removeClass('icon-chevron-up').addClass('icon-chevron-down')
    else
      feedSortMe.sort (a,b) ->
        if (moment(a['date']) > moment(b['date']))
          return 1
        if (moment(a['date']) < moment(b['date']))
          return -1
        return 0
      $('.sort-date').removeClass('descending').addClass('ascending')
      $('.sort-title i, .sort-feed i').removeClass('icon-chevron-down icon-chevron-up')
      $('.sort-date i').removeClass('icon-chevron-down').addClass('icon-chevron-up')

    console.log feedSortMe
    $.each feedSortMe, () ->
      $('.podcastList').append($('[data-uuid="' + this.uuid + '"]'))
