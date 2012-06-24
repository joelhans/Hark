jQuery ($) ->

  # ------------------------------
  # Link handlers
  # ------------------------------

  $(document)
    .delegate '.directory-feed-subscribe a', 'click', (e) ->
      e.preventDefault()
      $.ajax
        type    : 'POST'
        url     : '/directory/subscribe/' + $(this).attr('data-uuid')
        data    : $(this).attr('data-uuid')
        success : (data) ->
          console.log data

  $(document)
    .delegate '.category a', 'click', (e) ->
      e.preventDefault()
      $.ajax
        type    : 'POST'
        url     : $(this).attr('href')
        data    : $(this).attr('href')
        success : (data) ->
          console.log(data)
          $('.directory-main').html(data)