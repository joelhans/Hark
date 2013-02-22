# ------------------------------
# Layout
# ------------------------------
wookmark = () ->
  return

# ------------------------------
# Title
# ------------------------------

window.dir_title = () ->
  if typeof $('.directory-main').attr('data-category') isnt 'undefined'
    category = $('.directory-main').attr 'data-category'
    document.title = 'Hark | Directory | ' + $('a[href$="'+category+'/"]').text()

# ------------------------------
# Link handlers
# ------------------------------
$(document)
  .delegate '.directory-feed-subscribe', 'click', (e) ->
    e.preventDefault()
    $.ajax
      type    : 'POST'
      url     : $(e.currentTarget).attr 'href'
      error   : (err) ->
        $('#modal').html($(err.responseText))
        $('#modal').fadeIn(500)
      success : (data, textStatus, jqXHR) ->
        $(e.currentTarget).text('Subscribed!')

$(document)
  .delegate '.category a:not(.loadAll)', 'click', (e) ->
    e.preventDefault()
    $.ajax
      type    : 'POST'
      url     : $(this).attr('href')
      data    : $(this).attr('href')
      success : (data) ->
        $('.primary').html(data)
        console.log data
        ajaxHelpers()
        window.dir_pagination()

  .delegate '.category a.loadAll', 'click', (e) ->
    e.preventDefault()
    $.ajax
      type    : 'POST'
      url     : $(this).attr('href')
      data    : $(this).attr('href')
      success : (data) ->
        $('.hark-container').html(data)
        ajaxHelpers()
        window.dir_pagination()

# ------------------------------
# Search
# ------------------------------

$(document).on 'click', '.directory-search-submit', (e) ->
  e.preventDefault()
  data =
    string : $('.directory-search-term').val()
  $.ajax
    type   : 'POST'
    url    : '/directory/search'
    data   : data
    success: (data) ->
      $('.hark-container').html(data)
      ajaxHelpers()

$(document).on 'keypress', '.directory-search-submit', (e) ->
  if e.which is 13
    e.preventDefault()
    data =
      string : $('.directory-search-term').val()
    $.ajax
      type   : 'POST'
      url    : '/directory/search'
      data   : data
      success: (data) ->
        $('.hark-container').html(data)
        ajaxHelpers()

# ------------------------------
# Sorting
# ------------------------------

# By popularity

$(document).on 'click', '.directory-sort-popularity', (e) ->
  if $(this).is('.desc')
    $('.directory-item').tsort({attr:'data-subs'})
    $('.directory-sort-popularity').removeClass('desc').addClass('asc')
  else
    $('.directory-item').tsort({order:'desc', attr:'data-subs'})
    $('.directory-sort-popularity').removeClass('asc').addClass('desc')

# Alphabetically

$(document).on 'click', '.directory-sort-alphabetical', (e) ->
  if $(this).is('.desc')
    $('.directory-item').tsort($(this).children('h1').text(), {order:'desc'})
    $('.directory-sort-alphabetical').removeClass('desc').addClass('asc')
  else
    $('.directory-item').tsort($(this).children('h1').text(), {order:'asc'})
    $('.directory-sort-alphabetical').removeClass('asc').addClass('desc')

# Latest podcast

$(document).on 'click', '.directory-sort-latest', (e) ->
  if $(this).is('.desc')
    $('.directory-item').tsort({attr:'data-date'})
    $('.directory-sort-latest').removeClass('desc').addClass('asc')
  else
    $('.directory-item').tsort({order:'desc', attr:'data-date'})
    $('.directory-sort-latest').removeClass('asc').addClass('desc')

# Pure alpha

$(document).on 'click', '.directory-sort-pure-alpha', (e) ->
  e.preventDefault()
  category = null
  if typeof(top.location.pathname.split('/')[3]) isnt 'undefined'
    category = top.location.pathname.split('/')[3]
  $.ajax
    type    : 'POST'
    url     : '/directory/sort-title'
    data    : {
      category: category
    }
    success : (data) ->
      $('.hark-container').html(data)
      ajaxHelpers()

# ------------------------------
# Pagination
# ------------------------------

window.dir_pagination = () ->
  current_page = parseInt($('.directory-main').attr 'data-page')
  if current_page is 1
    $('.pagination-next').attr('href', '/directory/page/2')
    $('.pagination-prev').css({'opacity': 0})
  else
    prev_page = current_page - 1
    next_page = current_page + 1
    $('.pagination-prev').attr('href', '/directory/page/' + prev_page)
    $('.pagination-next').attr('href', '/directory/page/' + next_page)

$(document).on 'click', '.pagination-prev', (e) ->
  e.preventDefault()
  category = null
  if typeof(top.location.pathname.split('/')[3]) isnt 'undefined'
    category = top.location.pathname.split('/')[3]
  $.ajax
    type    : 'POST'
    url     : $(this).attr 'href'
    data    : {
      category: category
    }
    success : (data) ->
      $('.hark-container').html(data)
      ajaxHelpers()
      window.dir_pagination()

$(document).on 'click', '.pagination-next', (e) ->
  e.preventDefault()
  category = null
  if typeof(top.location.pathname.split('/')[3]) isnt 'undefined'
    category = top.location.pathname.split('/')[3]
  $.ajax
    type    : 'POST'
    url     : $(this).attr 'href'
    data    : {
      category: category
    }
    success : (data) ->
      $('.hark-container').html(data)
      ajaxHelpers()
      window.dir_pagination()