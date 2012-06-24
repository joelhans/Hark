jQuery ($) ->

  # ------------------------------
  # Sidebar height
  # ------------------------------

  $(document).ready () ->
    sidebarHeight()
    listenHeight()

  window.onresize = (event) ->
    sidebarHeight()
    listenHeight()

  sidebarHeight = () ->
    c_width = $(window).width()
    c_height = $(window).height()
    sidebar = $('.sidebar')
    $('.sidebar').css('height', c_height - 176)

  listenHeight = () ->
    c_width = $(window).width()
    c_height = $(window).height()
    listen = $('.primary')
    $('.primary').css('height', c_height - 176)

  # ------------------------------
  # Sidebar hover effect
  # ------------------------------

  $('.categories li:not(.safe), .subscriptions li:not(.safe)')
    .hover (e) ->
      $('.hover-er').css('top', $(e.currentTarget).offset().top + 0).css('opacity', '100').css('height', $(e.currentTarget).height())
    , (e) ->
      $('.hover-er').css('opacity', '0')

  $(document).delegate '.currently-playing li:not(.heading)', 'mouseover mouseout', (e) ->
    if (e.type = 'mouseover')
      $('.hover-er').css('top', $(e.currentTarget).offset().top + 0).css('opacity', '100').css('height', $(e.currentTarget).height())
    else if (e.type = 'mouseout')
      $('.hover-er').css('opacity', '0')