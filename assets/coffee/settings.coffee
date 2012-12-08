window.settings = () ->

  $(document)
    .delegate '.delete', 'click', (e) ->
      e.preventDefault()
      $('.settings-mask, .settings-modal-error').fadeIn(200)

  $(document)
    .delegate '.delete-confirm', 'click', (e) ->
      e.preventDefault()
      $.ajax
        type    : 'POST'
        url     : '/settings/delete'
        success : (data) ->
          console.log('Deleted!')