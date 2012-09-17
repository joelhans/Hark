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
    errorAlerts: true,
    volume: 0.5,
    play: function(d) {
      $('.podcast-player').css({'top': '0px'});
      $('.video-podcast-player').css({'top': '90px'});
      $('.video-player').fadeOut(300)
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
    },
    ready:function(d) {
      if (typeof(playing) !== 'undefined' && playing.podcast.indexOf('mp3') !== -1 ) {
        $('.podcast-player').css({'top': '0px'});
        mediaData = playing;
        playStatus(playing.progress, playing);
        $('#jquery_jplayer_1').jPlayer("setMedia", {
          mp3: playing.podcast
        }).jPlayer('pause', Math.round(playing.progress));
      }
    }
  });

  $('#jquery_jplayer_2').jPlayer({
    swfPath: "/js/",
    supplied: 'm4v, m4a',
    // solution: 'html, flash',
    solution: 'html, flash',
    volume: 0.5,
    cssSelectorAncestor: "#jp_container_2",
    errorAlerts: true,
    play: function(d) {
      $('.podcast-player').css({'top': '90px'});
      $('.video-podcast-player').css({'top': '0px'});
      $('.video-player').fadeIn(300)
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
      $('#jquery_jplayer_2').fadeOut(300)
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
    },
    ready:function(d) {
      console.log(playing.podcast.indexOf('mp4'));
      if (typeof(playing) !== 'undefined' && playing.podcast.indexOf('mp4') !== -1 ) {
        $('.podcast-player').css({'top': '90px'});
        $('.video-podcast-player').css({'top': '0px'});
        $('#jquery_jplayer_2').fadeIn(300)
        mediaData = playing;
        playStatus(playing.progress, playing);
        $('#jquery_jplayer_2').jPlayer("setMedia", {
          m4v: playing.podcast
        }).jPlayer('pause', Math.round(playing.progress));
      }
    }
  });

  //
  //  Manual synchronization.
  //

  $('.manual-sync').click(function(e) {
    if ( $('#jquery_jplayer_1').data().jPlayer.status.paused === false ) {
      progress = $('#jquery_jplayer_1').data("jPlayer").status.currentTime;
    } else if ( $('#jquery_jplayer_2').data().jPlayer.status.paused === false ) {
      progress = $('#jquery_jplayer_2').data("jPlayer").status.currentTime;
    }
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
    if ( mediaData.podcast.indexOf('mp4') == -1 ) {
      $('#jquery_jplayer_1').jPlayer("pauseOthers").jPlayer("setMedia", {
        mp3: mediaData.podcast
      }).jPlayer('play');
    }
    else {
      $('#jquery_jplayer_2').jPlayer("pauseOthers").jPlayer("setMedia", {
        m4v: mediaData.podcast
      }).jPlayer('play');
    }
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
    if ( mediaData.podcast.indexOf('mp4') == -1 ) {
      $('#jquery_jplayer_1').jPlayer("pauseOthers").jPlayer("setMedia", {
        mp3: mediaData.podcast
      }).jPlayer('play');
    }
    else {
      $('#jquery_jplayer_2').jPlayer("pauseOthers").jPlayer("setMedia", {
        m4v: mediaData.podcast
      }).jPlayer('play');
    }
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
