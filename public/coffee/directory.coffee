# ------------------------------
# Layout
# ------------------------------
wookmark = () ->
  # $('.directory-item').wookmark({
  #   container: $('.directory-main'),
  #   offset: 20,
  #   autoResize: true
  # });

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
        wookmark()

  .delegate '.category a.loadAll', 'click', (e) ->
    e.preventDefault()
    $.ajax
      type    : 'POST'
      url     : $(this).attr('href')
      data    : $(this).attr('href')
      success : (data) ->
        $('.hark-container').html(data)
        ajaxHelpers()
        wookmark()

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