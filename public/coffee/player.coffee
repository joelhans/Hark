
# playStatus = (progress, mediaData) ->
#   sessionStorage.setItem("podcast", mediaData.podcast)
#   sessionStorage.setItem("podcastID", mediaData.podcastID)
#   sessionStorage.setItem("feedUUID", mediaData.feedUUID)
#   sessionStorage.setItem("feedTitle", mediaData.feedTitle)
#   sessionStorage.setItem("podcastTitle", mediaData.podcastTitle)
#   sessionStorage.setItem("progress", progress)


jplayer = () ->

	# ------------------------------
	# Manual sync button
	# ------------------------------
	# $('.manual-sync').click (e) ->
	# 	console.log 'fuck me'
 #    if $('#jquery_jplayer_1').data().jPlayer.status.paused is false
 #      progress = $('#jquery_jplayer_1').data("jPlayer").status.currentTime
 #    else if $('#jquery_jplayer_2').data().jPlayer.status.paused is false
 #      progress = $('#jquery_jplayer_2').data("jPlayer").status.currentTime
 #    else
 #    	console.log 'WTF'
 #    console.log progress, mediaData
 #    playStatus(progress, mediaData)
 #    updateStatus()

	# ------------------------------
	# Move video player
	# ------------------------------

	$(document)
		.delegate '.video-move', 'mousedown', (e) ->
			$(window).bind 'mousemove', (e) ->
				$('.video-player').removeClass('minimized')
				$('.video-player').css({'top': e.clientY - 20, 'left': e.clientX + 250, 'margin-left': ''})
		.delegate '.video-move', 'mouseup', (e) ->
			$('.video-move').undelegate()
			$(window).unbind 'mousemove'

	# ------------------------------
	# Minimize video player
	# ------------------------------

	$('.video-minimize')
		.on 'click', (e) ->
			if $('.video-player').is('.minimized')
				$('.video-player').removeClass('minimized')
				half_width = $('.video-player').width() / 2
				pos = $(window).width() - half_width
				$('.video-player').css({'bottom': 100 + 'px', 'left': '50%', 'margin-left': -(half_width) + 'px'})
			else
				$('.video-player').addClass('minimized')
				pos = $(window).width() - $('.video-player').width() / 2
				$('.video-player').css({'bottom': -180 + 'px', 'left': pos, 'top': '', 'margin-left': ''})