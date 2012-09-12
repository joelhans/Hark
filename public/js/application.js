// HISTORY.js

$(document).ready(function() {

  var mediaData,
      progress;

  //
  //  jPlayer initialization.
  //

  $('#jquery_jplayer_1').jPlayer({
    swfPath: "/js",
    supplied: 'mp3',
    // solution: 'html, flash',
    solution: 'flash, html',
    errorAlerts: false,
    volume: 0.5,
    play: function(d) {
      $('.jp-playing').fadeIn(300);
      updatePlaying = setInterval(function(){
        updateStatus();
      }, 120000);
    },
    timeupdate: function(d) {
      progress = d.jPlayer.status.currentTime;
      playStatus(progress, mediaData);
    },
    pause: function(d) {
      clearInterval(updatePlaying);
    },
    ended: function(d) {
      clearInterval(updatePlaying);
      $('[data-uuid="' + mediaData.podcastID + '"]')
        .animate(
          { opacity: '0' },
          { duration: 600
        })
        .animate(
          { height: '0px', 'margin-bottom': '0px' },
          { duration: 600,
          complete: function() {
            $(this).remove();
            $('.jp-playing').fadeOut(300).html('');
          }
      });
      $.ajax({
        type: 'POST',
        url: '/listen/' + mediaData.feedUUID + '/listened/' + mediaData.podcastID,
        data: mediaData,
        success: function() {},
        error: function() {
          console.log('jPlayer had an error.');
        }
      });
    },
    error:function(d) {
      console.log('ERROR:' + d);
      // $('.error-text').html('There is a problem with the podcast player. A common solution is to disable any Flash-blocking software in your browser.');
      // $('#error-mask').fadeIn(200);
      // $('.js-modal-error').fadeIn(200);
    },
    ready:function(d) {
      if (typeof(playing) !== 'undefined') {
        mediaData = playing;
        playStatus(playing.progress, playing);
        $('#jquery_jplayer_1').jPlayer("setMedia", {
          mp3: playing.podcast
        }).jPlayer('pause', Math.round(playing.progress));
      }
    }
  });

  //
  //  Manual synchronization.
  //

  $('.manual-sync').click(function(e) {
    progress = $('#jquery_jplayer_1').data("jPlayer").status.currentTime;
    playStatus(progress, mediaData);
    updateStatus();
  });

  //
  //  Mark a podcast as "listened."
  //

  $(document).delegate('.podcastListened', 'click', function(e) {
    e.preventDefault();
    var split = this.className.split(' ');
    var delegator = split[1];

    if ( delegator === 'all' ) {
      var data = {
        id : $(this).attr('href').split('/')[4],
        feed : $(this).attr('href').split('/')[2]
      };
      $(this).parent().parent().parent()
        // Why .parent('.podcastItem') doesn't work counfounds and annoys me.
        .animate(
          { opacity: '0' },
          { duration: 600
        })
        .animate(
          { height: '0px', 'margin-bottom': '0px' },
          { duration: 600,
          complete: function() {
            $(this).remove();
      leftFixHeight();
          }
        });
      $.ajax({
        type: 'POST',
        url: '/listen/' + data.feed + '/listened/' + data.id,
        data: data,
        success: function(data) {
          console.log('Marked as listened!' + data)
        },
        error: function(data) {
          console.log('Hark had an error.' + data);
        }
      });
    } else if ( delegator === 'single' ) {
      var data = {
        id : $(this).attr('href').split('/')[4],
        feed : $(this).attr('href').split('/')[2]
      };
      $('#' + data.id).removeClass('false');
      $.ajax({
        type: 'POST',
        url: '/listen/' + data.feed + '/listened/' + data.id,
        data: data,
        success: function() {  },
        error: function() {
          console.log('Hark had an error.');
        }
      });
    }
  });

  $(document).delegate('.act-mark.active', 'click', function(e) {

    var split = $('.selected').attr('class').split(/\s+/);
    var delegator = split[1];
    var data = {
      podcastID: $('.selected').attr("data-uuid"),
      feedUUID: $('.selected').attr("data-feedUUID")
    }

    if ( delegator === 'all' ) {
      $('.selected')
        .animate(
          { opacity: '0' },
          { duration: 600
        })
        .animate(
          { height: '0px', 'margin-bottom': '0px' },
          { duration: 600,
          complete: function() {
            $(this).remove();
      
      leftFixHeight();
          }
        });
      $.ajax({
        type: 'POST',
        url: '/listen/' + data.feedUUID + '/listened/' + data.podcastID,
        data: data,
        success: function(data) {
          console.log('Marked as listened!' + data)
        },
        error: function(data) {
          console.log('Hark had an error.' + data);
        }
      });
    } else if ( delegator === 'single' ) {
      $('#' + data.podcastID).removeClass('false');
      $.ajax({
        type: 'POST',
        url: '/listen/' + data.feed + '/listened/' + data.id,
        data: data,
        success: function(data) {
          console.log('Marked as listened!' + data)
        },
        error: function() {
          console.log('Hark had an error.');
        }
      });
    }
  });

  //
  // Listen to a podcast.
  //

  $(document).delegate('.podcastListen', 'click', function(e) {
    e.preventDefault();
    mediaData = {
      podcast: $(this).attr("data-file"),
      podcastTitle: $(this).attr("data-title"),
      podcastID: $(this).attr('href').split('/')[3],
      feedUUID: $(this).attr('href').split('/')[2],
      feedTitle: $(this).attr("data-feed")
    }
    $('#jquery_jplayer_1').jPlayer("setMedia", {
      mp3: mediaData.podcast
    }).jPlayer('play');
    $.ajax({
      type: 'POST',
      url: '/listen/' + mediaData.feedUUID + '/' + mediaData.podcastID,
      data: mediaData,
      success: function(data) {
        console.log(data);
        $('.currently-playing').html(data);
      }
    });
  });

  $(document).delegate('.act-listen.active', 'click', function(e) {
    mediaData = {
      podcast: $('.selected').attr("data-file"),
      podcastTitle: $('.selected').attr("data-title"),
      podcastID: $('.selected').attr("data-uuid"),
      feedUUID: $('.selected').attr("data-feedUUID"),
      feedTitle: $('.selected').attr("data-feed")
    }
    $('#jquery_jplayer_1').jPlayer("setMedia", {
      mp3: mediaData.podcast
    }).jPlayer('play');
    $.ajax({
      type: 'POST',
      url: '/listen/' + mediaData.feedUUID + '/' + mediaData.podcastID,
      data: mediaData,
      success: function(data) {
        $('.currently-playing').html(data);
      }
    });
  });


  //
  //  Sorting.
  //

  // $(document).delegate('.sort-feed', 'click', function(e) {
  //   e.preventDefault();

  //   var feedSortMe = new Array();

  //   $('.podcast-item').each(function() {
  //     sortData = {
  //       uuid: $(this).attr('data-uuid'),
  //       feedTitle: $(this).children('.podcastFeed').children().text()
  //     }
  //     feedSortMe.push(sortData);
  //     });

  //   if ( $('.sort-feed').hasClass('descending') !== true ) {
  //     feedSortMe.sort(function (a,b) {
  //       if (a['feedTitle'].toLowerCase() > b['feedTitle'].toLowerCase())
  //         return 1;
  //       if (a['feedTitle'].toLowerCase() < b['feedTitle'].toLowerCase())
  //         return -1;
  //       return 0;
  //     });
  //     $('.sort-feed').addClass('descending');
  //     $('.sort-title i, .sort-date i').removeClass('icon-chevron-down icon-chevron-up');
  //     $('.sort-feed i').removeClass('icon-chevron-up').addClass('icon-chevron-down');
  //   } else {
  //     feedSortMe.sort(function (a,b) {
  //       if (a['feedTitle'].toLowerCase() < b['feedTitle'].toLowerCase())
  //         return 1;
  //       if (a['feedTitle'].toLowerCase() > b['feedTitle'].toLowerCase())
  //         return -1;
  //       return 0;
  //     });
  //     $('.sort-feed').removeClass('descending').addClass('ascending');
  //     $('.sort-title i, .sort-date i').removeClass('icon-chevron-down icon-chevron-up');
  //     $('.sort-feed i').removeClass('icon-chevron-down').addClass('icon-chevron-up');
  //   }

  //   $.each(feedSortMe, function(){
  //     $('.podcastList').append($('[data-uuid="' + this.uuid + '"]'));
  //   });
  // });

  $(document).delegate('.sort-title', 'click', function(e) {
    e.preventDefault();

    var feedSortMe = new Array();

    $('.podcast-item').each(function() {
      sortData = {
        uuid: $(this).attr('data-uuid'),
        podcastTitle: $(this).children('.podcast-title').children().text()
      }
      feedSortMe.push(sortData);
    });

    if ( $('.sort-title').hasClass('descending') !== true ) {
      feedSortMe.sort(function (a,b) {
        if (a['podcastTitle'].toLowerCase() > b['podcastTitle'].toLowerCase())
          return 1;
        if (a['podcastTitle'].toLowerCase() < b['podcastTitle'].toLowerCase())
          return -1;
        return 0;
      });
      $('.sort-title').addClass('descending');
      $('.sort-feed i, .sort-date i').removeClass('icon-chevron-down icon-chevron-up');
      $('.sort-title i').removeClass('icon-chevron-up').addClass('icon-chevron-down');
    } else {
      feedSortMe.sort(function (a,b) {
        if (a['podcastTitle'].toLowerCase() < b['podcastTitle'].toLowerCase())
          return 1;
        if (a['podcastTitle'].toLowerCase() > b['podcastTitle'].toLowerCase())
          return -1;
        return 0;
      });
      $('.sort-title').removeClass('descending').addClass('ascending');
      $('.sort-feed i, .sort-date i').removeClass('icon-chevron-down icon-chevron-up');
      $('.sort-title i').removeClass('icon-chevron-down').addClass('icon-chevron-up');
    }

    $.each(feedSortMe, function() {
      $('.podcastList').append($('[data-uuid="' + this.uuid + '"]'));
    });
  });

  $(document).delegate('.sort-date', 'click', function(e) {
    e.preventDefault();

    var feedSortMe = new Array();

    $('.podcast-item').each(function() {
      sortData = {
        uuid: $(this).attr('data-uuid'),
        date: $(this).children('.podcast-date').children('.moment').attr('data-date')
      }
      feedSortMe.push(sortData);
    });

    if ( $('.sort-date').hasClass('descending') !== true ) {
      feedSortMe.sort(function (a,b) {
        if (moment(a['date']) < moment(b['date']))
          return 1;
        if (moment(a['date']) > moment(b['date']))
          return -1;
        return 0;
      });
      $('.sort-date').addClass('descending');
      $('.sort-title i, .sort-feed i').removeClass('icon-chevron-down icon-chevron-up');
      $('.sort-date i').removeClass('icon-chevron-up').addClass('icon-chevron-down');
    } else {
      feedSortMe.sort(function (a,b) {
        if (moment(a['date']) > moment(b['date']))
          return 1;
        if (moment(a['date']) < moment(b['date']))
          return -1;
        return 0;
      });
      $('.sort-date').removeClass('descending').addClass('ascending');
      $('.sort-title i, .sort-feed i').removeClass('icon-chevron-down icon-chevron-up');
      $('.sort-date i').removeClass('icon-chevron-down').addClass('icon-chevron-up');
    }

    $.each(feedSortMe, function() {
      $('.podcastList').append($('[data-uuid="' + this.uuid + '"]'));
    });
  });

  //
  //  Settings.
  //

  $(document).delegate('.delete', 'click', function(e) {
    e.preventDefault();
    $('.settings-mask').fadeIn(200);
    $('.settings-modal-error').fadeIn(200);
  });

  $(document).delegate('.delete-confirm', 'click', function(e) {
    e.preventDefault();
    $.ajax({
      type: 'POST',
      url: '/settings/delete',
      success: function(data) {
        console.log('Deleted!');
      }
    });
  });

  //
  //  Play status.
  //

  function playStatus(progress, mediaData) {
    sessionStorage.setItem("podcast", mediaData.podcast);
    sessionStorage.setItem("podcastID", mediaData.podcastID);
    sessionStorage.setItem("feedUUID", mediaData.feedUUID);
    sessionStorage.setItem("feedTitle", mediaData.feedTitle);
    sessionStorage.setItem("podcastTitle", mediaData.podcastTitle);
    sessionStorage.setItem("progress", progress);
  }

  function updateStatus() {
    var playing = {
      "podcast" : sessionStorage.getItem("podcast"),
      "podcastID" : sessionStorage.getItem("podcastID"),
      "podcastTitle" : sessionStorage.getItem("podcastTitle"),
      "feedTitle" : sessionStorage.getItem("feedTitle"),
      "feedUUID" : sessionStorage.getItem("feedUUID"),
      "progress" : sessionStorage.getItem("progress")
    }
    $.ajax({
      type: 'POST',
      url: '/listen/playing',
      data: playing,
      success: function(data) {
        console.log('Sync-ed! ' + data);
      },
      error: function(data) {
        console.log('Error with syncing! ' + data);
        return;
      }
    });
  }

});
