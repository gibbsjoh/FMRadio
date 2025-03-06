// version 0.02 - adding support for non-HLS via the <audio> tag
// version 0.03 - changed the id of the debug message
// version 0.04 - cleaned up JS, added support for M3U playlists of songs, some additions to HTML

function myFMPlayer (theURL,theStationName) {
    var theBrowser = navigator.userAgent;
    let theFirstChars = theURL.substring(0,4);
    // are we on iPhone?
    // to do: iPad support
    if (theBrowser.includes("iPhone")){
      is_iOS = 1;
    } else {
      is_iOS = 0;
    }
    console.log(theFirstChars);

  // show the station name in the WebViewer
  let playerStatus = "Playing";
  let playerNowPlaying = playerStatus.concat(" ", theStationName);
  document.getElementById("playerStationName").innerHTML = playerNowPlaying;

  var isPlaylist;
  var thePlaylist;
  var urlToPlay;

   // Uses HLS.js on non-Safari, Safari-native on iOS
   // to do: Play streams in different formats (not just M3U8) **DONE, seems to work**
   // also to do: make the web viewer display look nicer **IN PROGRESS**
    
    // if it's a pure M3U file, we pass the file contents, not the URL
    if (!theFirstChars.includes("http")){
      thePlaylist = theURL;
      isPlaylist = 1;
    } else {
      urlToPlay = decodeURIComponent(theURL);
      isPlaylist = 0;
    }

    console.log(isPlaylist);
    
    var video = document.getElementById('videoPlayer');

    // ****** HLS/M38U on iOS Safari (in the case, FileMakerGo is iOS Safari bc it uses that browser engine)
    if (is_iOS == 1 && theURL.includes("m3u8")){
        document.getElementById("playerDebug").innerHTML = "Using Safari native player";
        video.src = urlToPlay;
        video.addEventListener('loadedmetadata', function() {
            video.play();
        });
    } 
    // ****** M3U playlist (or M3U Extended), uses native HTML5 player
    else if (isPlaylist == 1){
        // use the parser
        console.log("Parser");
        document.getElementById("playerDebug").innerHTML = "Using M3U Parser";
          //console.log(thePlaylist);
          var playlist = M3U.parse(thePlaylist);
          //console.log(playlist);
          let i = 0;
          if (i < playlist.length) {
            let thisSong = playlist[i++].file;
            let thisSongName = playlist[i++].title;
            let thisArtist = playlist[i++].artist;
            // Tell us what song is playing
            onNow = thisArtist + " - " + thisSongName;
            document.getElementById("playlistNowPlaying").innerHTML = onNow;
            const audioPlayer = document.getElementById('videoPlayer');
            audioPlayer.src = thisSong;
            audioPlayer.addEventListener('loadedmetadata', function() {
              audioPlayer.play();
            });
            // Set the source of the audio element to the stream URL
            // audioPlayer.src = thisSong;
            // // Optionally, you can start playing the stream automatically
            // audioPlayer.play().catch(error => {
            // console.error('Error playing the audio stream:', error);
            // });
          }
 
    } 
    // ***** For Non-Safari, uses HLS.js to play HLS/M38U
    else if (Hls.isSupported() && theURL.includes("m3u8")) {
        document.getElementById("playerDebug").innerHTML = "Using HLS.js";
        var hls = new Hls();
        hls.loadSource(urlToPlay);
        hls.attachMedia(video);
        hls.on(Hls.Events.MANIFEST_PARSED, function() {
            video.play();
        });
    } 
    // ***** "Everything else" - it's not a M3U playlist, it's not a HLS/M3U8 playlist, so we use HTML5 native player
    else if (!theURL.includes("m3u8")) { // non-HLS streams? 
        document.getElementById("playerDebug").innerHTML = "Non-HLS stream";
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
      document.getElementById("playerDebug").innerHTML = "Playback not supported";
    }
  }