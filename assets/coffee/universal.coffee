$ = jQuery
History = State = progress = path = dir_pagination = mediaData = progress = null

# ------------------------------
# On document load
# ------------------------------

$(document).ready () ->
  console.log playing
  window.ajaxHelpers()
  State = History.getState()
  window.dir_pagination()
  window.settings()
  return

window.onload = () ->
  window.jplayer_1()
  window.jplayer_2()
  window.jplayer()

# ------------------------------
# On window resize
# ------------------------------

window.onresize = (event) ->
  sidebarHeight()
  listenHeight()

# ------------------------------
# Helpers that make AJAX more hospitable
# ------------------------------

window.ajaxHelpers = () ->
  sidebarHeight()
  listenHeight()
  momentize()
  # $('#loading').fadeOut(300)

# ------------------------------
# HTML5 HISTORY
# ------------------------------

History = window.History
siteUrl = "http://" + top.location.host.toString()

$(document)
  .delegate 'a:not(.history-ignore)[href="/listen"], 
             a[href="/directory"],
             a[href="/settings"],
             a[href="/help"],
             a[href^="/listen/podcast/"],
             a[href^="/directory/category/"]', "click", (e) ->
    e.preventDefault()
    State = History.getState()
    path = $(e.currentTarget).text()
    History.pushState {}, "", $(e.currentTarget).attr 'href'

History.Adapter.bind window, 'statechange', () ->
  # $('#loading').fadeIn(300)
  State = History.getState()
  History.log(State.data, State.title, State.url, State.hash)
  if State.hash == '/listen' || State.hash == '/listen/'
    $.ajax
      type: 'POST'
      url: '/listen'
      success: (data) ->
        $('.hark-container').replaceWith(data)
        document.title = 'Hark | Your podcasts'
        window.ajaxHelpers()
  else if State.hash == '/directory' || State.hash == '/directory/'
    $.ajax
      type: 'POST'
      url: '/directory'
      success: (data) ->
        $('.hark-container').html(data)
        window.dir_pagination()
        document.title = 'Hark | The Directory'
        window.ajaxHelpers()
  else if State.hash == '/settings' || State.hash == '/settings/'
    $.ajax
      type: 'POST'
      url: '/settings'
      success: (data) ->
        $('.hark-container').html(data)
        document.title = 'Hark | Your settings'
        window.ajaxHelpers()
  else if State.hash == '/help' || State.hash == '/help/'
    $.ajax
      type: 'POST'
      url: '/help'
      success: (data) ->
        $('.hark-container').html(data)
        document.title = 'Hark | FAQ & Help'
        window.ajaxHelpers()
  else if State.hash.indexOf('/listen/podcast/') isnt -1
    $.ajax
      type: 'POST'
      data: { feedID : State.hash.split('/')[3] }
      url: State.hash
      success: (data) ->
        $('.primary').html(data)
        document.title = 'Hark | ' + $(data).find('.podcast-item:first-of-type').attr('data-feed')
        window.ajaxHelpers()
  else if State.hash.indexOf('/directory/category/') isnt -1
    $.ajax
      type: 'POST'
      data: { feedID : State.hash.split('/')[3] }
      url: State.hash
      success: (data) ->
        $('.primary').html(data)
        window.dir_pagination()
        # document.title = 'Hark | The Directory | ' + path
        window.ajaxHelpers()
  else
    return

$(document)
  .delegate '.current-item, .current-feed', 'click', (e) ->
    e.preventDefault()
    if $(e.currentTarget).is('.blank')
      console.log('blank');
      return
    else
      data =
        feedID : $(this).attr('href').split('/')[3]
      $.ajax
        type:    'POST'
        data:    data
        url:     '/listen/podcast/' + data.feedID
        success: (data) ->
          $('.primary').html(data)
          window.ajaxHelpers()

# ------------------------------
# Sidebar height
# ------------------------------

sidebarHeight = () ->
  c_width = $(window).width()
  c_height = $(window).height()
  sidebar = $('.sidebar')
  $('.sidebar').css('height', c_height - 171)

listenHeight = () ->
  c_width = $(window).width()
  c_height = $(window).height()
  listen = $('.primary')
  $('.primary').css('height', c_height - 171)

# ------------------------------
# Error handling
# ------------------------------

$('.modal-close')
  .live 'click', (e) ->
    $('#modal').fadeOut(200)

# ------------------------------
# Sidebar hover effect
# ------------------------------

$(document)
  .delegate '.categories li:not(.safe), .subscriptions li:not(.safe), .currently-playing li:not(.heading), .choose-settings li:not(.safe), .questions li:not(.safe)', 'hover', (e) ->
    if e.type == 'mouseenter'
      $('.hover-er').css('top', $(e.currentTarget).offset().top + 0).css('opacity', '100').css('height', $(e.currentTarget).height())
    else
      if $(e.currentTarget).children('.sidebar-expander').is('.expanded')
        return
      else
        $('.hover-er').css('opacity', '0')

# ------------------------------
# "Momentize": change dates to human-readable ones
# ------------------------------

momentize = () ->
  $('.moment').each (i) ->
    $(this).attr('data-date', $(this).text())
    $(this).text(moment($(this).text()).fromNow())