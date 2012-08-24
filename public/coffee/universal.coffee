$ = jQuery

# ------------------------------
# On document load
# ------------------------------

$(document).ready () ->
  ajaxHelpers()

  State = History.getState()
  console.log State

  wookmark()
  
# ------------------------------
# On window resize
# ------------------------------

window.onresize = (event) ->
  sidebarHeight()
  listenHeight()

# ------------------------------
# Helpers that make AJAX more hospitable
# ------------------------------

ajaxHelpers = () ->
  sidebarHeight()
  listenHeight()
  momentize()

# ------------------------------
# HTML5 HISTORY
# ------------------------------

History = window.History
siteUrl = "http://" + top.location.host.toString()

$(document)
  .delegate 'a[href="/listen"], a[href="/directory"], a[href="/settings"], a[href="/help"]', "click", (e) ->
    e.preventDefault()
    State = History.getState()
    console.log State
    History.pushState {}, "", $(e.currentTarget).attr 'href'

History.Adapter.bind window, 'statechange', () ->
  State = History.getState()
  History.log(State.data, State.title, State.url)
  if State.hash == '/listen'
    $.ajax
      type: 'POST'
      url: '/listen'
      success: (data) ->
        $('.hark-container').replaceWith(data)
        ajaxHelpers()
  else if State.hash == '/directory'
    $.ajax
      type: 'POST'
      url: '/directory'
      success: (data) ->
        $('.hark-container').html(data)
        ajaxHelpers()
        wookmark()
  else if State.hash == '/settings'
    $.ajax
      type: 'POST'
      url: '/settings'
      success: (data) ->
        $('.hark-container').html(data)
        ajaxHelpers()
  else if State.hash == '/help'
    $.ajax
      type: 'POST'
      url: '/help'
      success: (data) ->
        $('.hark-container').html(data)
        ajaxHelpers()
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
          ajaxHelpers()

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