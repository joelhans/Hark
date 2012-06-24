jQuery ($) ->

  # ------------------------------
  # Add a feed
  # ------------------------------

  $(document)
    .delegate '.act-add', 'click', (e) ->
      $('.add-feed-container').toggle()

  # ------------------------------
  # Go back to all feeds
  # ------------------------------

  $('.allFeeds')
    .on 'click', (e) ->
      e.preventDefault()
      History.pushState {}, "", e.currentTarget
      $.ajax
        type    : 'POST'
        url     : '/listen'
        success : (data) ->
          $('.primary').html(data)


  # $(document).delegate('.allFeeds', 'click', function(e) {
  #   e.preventDefault();
  #   var data = { feed : $(this).attr('href').split('/')[3] };
  #   History.pushState({}, "", this);
  #   $.ajax({
  #     type: 'POST',
  #     url: '/listen/',
  #     data: data,
  #     success: function(data) {
  #       $('#hark-podcasts').html(data);
  #       leftFixHeight();
  #     }
  #   });
  # });