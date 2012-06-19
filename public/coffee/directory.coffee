# Directory

jQuery ($) ->

  $(document)
    .delegate '.directory-subscribe', 'click', (e) ->
      e.preventDefault()
      $.ajax
        type    : 'POST'
        url     : '/directory/subscribe/' + $(this).attr('data-uuid')
        data    : $(this).attr('data-uuid')
        success : (data) ->
          console.log data