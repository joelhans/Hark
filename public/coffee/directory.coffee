# ------------------------------
# Layout
# ------------------------------
wookmark = () ->
  $('.directory-item').wookmark({
    container: $('.directory-main'),
    offset: 20,
    autoResize: true
  });

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