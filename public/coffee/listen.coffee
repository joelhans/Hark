# ------------------------------
# Add a feed
# ------------------------------

$(document)
  .delegate '.act-add', 'click', (e) ->
    $('.add-feed-container').toggle()

$('.add-feed').live 'keypress', (e) ->
  if e.which is 13
    data =
      url: $(e.currentTarget).val()
    $.ajax
      type:    'POST'
      url:     '/listen/add'
      data:    data
      success: (data) ->
        $('.hark-container').html(data)
        $('.add-feed').val('')
        $('.add-feed-container').hide()
        ajaxHelpers()

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
      success: (data) ->
        $('.act-update a').text 'Update'
        $('.primary').html(data)
        ajaxHelpers()

# ------------------------------
# Go back to all feeds
# ------------------------------

$(document)
  .delegate '.allFeeds a', 'click', (e) ->
    e.preventDefault()
    $.ajax
      type    : 'POST'
      url     : '/listen/podcast/all'
      success : (data) ->
        $('.primary').html(data)
        ajaxHelpers()

# ------------------------------
# Load a single feed
# ------------------------------

$(document)
  .delegate '.loadFeed, .loadFeedFromItem', 'click', (e) ->
    e.preventDefault()
    data =
      feedID : $(this).attr('href').split('/')[3]
    $.ajax
      type:    'POST'
      data:    data
      url:     '/listen/podcast/' + data.feedID
      success: (data) ->
        $('.primary').html(data)
        ajaxHelpers()

# ------------------------------
# Sidebar feed actions
# ------------------------------

# Expand/collapse the edit/remove menu

$(document)
  .delegate '.sidebar-expander', 'click', (e) ->
    if $(e.currentTarget).is('.expanded')
      $(e.currentTarget).parent().removeClass('active')
      $(e.currentTarget).removeClass('expanded')
      $(e.currentTarget).next().addClass('undocked').fadeOut(300)
    else
      $(e.currentTarget).parent().addClass('active')
      $(e.currentTarget).addClass('expanded')
      $(e.currentTarget).next().addClass('undocked').fadeIn(300)

# Edit feed

$(document)
  .delegate '.sidebar-action-edit', 'click', (e) ->
    e.preventDefault()
    $('.sidebar-action-edit-input').css('opacity', '100')
    $('.sidebar-action-edit-input').val($('.loadFeed').text())

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
          ajaxHelpers()


# Remove feed

$(document)
  .delegate '.sidebar-action-remove', 'click', (e) ->
    e.preventDefault()
    data =
      feedID: $(e.currentTarget).attr('href').split('/')[3]
    $.ajax
      type:    'POST'
      data:    data
      url:     '/listen/remove/' + data.feedID
      success: (data) ->
        console.log data
        $('.hark-container').html(data)
        ajaxHelpers()

# ------------------------------
# Podcast actions
# ------------------------------

# Select a podcast

$(document)
  .delegate '.podcast-item', 'click', (e) ->
    $('.podcastItem').removeClass('selected')
    $(e.currentTarget).addClass('selected')
    $('.act-listen, .act-mark, .act-read, .act-source, .act-download').removeClass('inactive').addClass('active')

# De-select a podcast

$(document)
  .delegate '.selected', 'click', (e) ->
    $(e.currentTarget).removeClass('selected')
    $('.act-listen, .act-mark, .act-read, .act-source, .act-download').removeClass('active').addClass('inactive')

# Listen to a podcast
################################
# CoffeeScript conversion still needed.

# Mark a podcast as "listened."
################################
# CoffeeScript conversion still needed.

# Read a description

$(document)
  .delegate '.act-read.active', 'click', (e) ->
    $('.selected').children('.podcastDescription').toggle(500).promise().done () ->
      ajaxHelpers()
    return false

# Go through to external link

$(document)
  .delegate '.act-source.active', 'click', (e) ->
    window.open($('.selected').attr('data-source'), '_newtab')

# Download podcast

$(document)
  .delegate '.act-download.active', 'click', (e) ->
    window.open($('.selected').attr('data-file'), '_newtab')

# Sorting

$(document)
  .delegate '.act-sorting', 'click', (e) ->
    console.log 'hi'
    $('.act-sorting ul').toggle()