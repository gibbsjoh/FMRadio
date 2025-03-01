// version 0.02 - adding support for non-HLS via the <audio> tag

function myFMPlayer (theURL) {
  var theBrowser = navigator.userAgent;
  // are we on iPhone?
  // to do: iPad support
  if (theBrowser.includes("iPhone")){
    is_iOS = 1;
  } else {
    is_iOS = 0;
  }
 // Uses HLS.js on Windows, Safari-native on iOS
 // to do: Play streams in different formats (not just M3U8) **DONE, seems to work**
 // also to do: make the web viewer display look nicer

  let urlToPlay = decodeURIComponent(theURL);
  var video = document.getElementById('videoPlayer');
  if (is_iOS == 1 && theURL.includes("m38u")){
      document.getElementById("playerError").innerHTML = "Using Safari native player";
      video.src = urlToPlay;
      video.addEventListener('loadedmetadata', function() {
          video.play();
      });
  } else if (Hls.isSupported() && theURL.includes("m3u8")) {
      document.getElementById("playerError").innerHTML = "Using HLS.js";
      var hls = new Hls();
      hls.loadSource(urlToPlay);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, function() {
          video.play();
      });
  } else if (!theURL.includes("m3u8")) { // non-HLS streams? 
      document.getElementById("playerError").innerHTML = "Non-HLS stream";
      // for some reason this uses the video tag player anyway... weird!
      video.src = urlToPlay;
      const audioPlayer = document.getElementById('audioPlayer');
        // Set the source of the audio element to the stream URL
        audioPlayer.src = streamUrl;
        // Optionally, you can start playing the stream automatically
        audioPlayer.play().catch(error => {
            console.error('Error playing the audio stream:', error);
        });
      }
  else{
    // show an error
    document.getElementById("playerError").innerHTML = "Playback not supported";
  }
}