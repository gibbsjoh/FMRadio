// version 0.02 - adding support for non-HLS via the <audio> tag
// version 0.03 - changed the id of the debug message
// version 0.04 - cleaned up JS, added support for M3U playlists of songs, some additions to HTML
// version 0.05 - Added Perform FileMaker Script function and added to M3U playlist for testing (shows current song in FM)
//                Added dev/desktop settings layout
//                Added fields/scripts to import JS/HTML from specified files
//                M3U play next working
// version 0.06 - shows the playing track or station in the FM global (added for stations)
// version 0.07 - adding pause JS function and associated button in FM [wip]
// version 0.071 - debugging on WebDirect for M3U
// version 0.072 - verbose logging, pause/resume function

// version 0.1 - minor JS amend to detect Safari as the browser engine on macOS (includes FMP on macOS)

// 16/03/25 - adding "pause" and "resume" functions
function pauseOrResumePlayback(action){
  var thePlayer = document.getElementById("videoPlayer");
  if (action == "resume") {
    thePlayer.play();
    console.log("resuming");
} else if (action == "pause") {
  thePlayer.pause();
  console.log("pausing");
}
}

function myFMPlayer (theURL,theStationName, verboseLogging) {
    var theBrowser = navigator.userAgent;
    let theFirstChars = theURL.substring(0,4);
    // are we on iPhone?
    // to do: iPad support
    if (theBrowser.includes("iPhone")){
      is_iOS = 1;
    } else {
      is_iOS = 0;
    }
    if (verboseLogging == 1){
      console.log(theFirstChars);
    }
  
  // function to check if we're on Sarafi - may be overlapping the iOS check above?
  function isSafari() {
    return navigator.vendor && navigator.vendor.indexOf('Apple') > -1 &&
           navigator.userAgent && !navigator.userAgent.match('CriOS') &&
           !navigator.userAgent.match('FxiOS');
  }
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

   // added 0.05 06/03/25 - perform a FileMaker script when playing to show what's being played etc in FM
   function performFileMakerScript(fmScriptName,fmScriptParameter) {
    FileMaker.PerformScriptWithOption (  fmScriptName, fmScriptParameter );
  }
   

    //available scripts (to be added to if needed):
    // STATION > Show Now Playing
  
    // ****** M3U playlist (list of songs w/ urls)
    // if it's a pure M3U file, we pass the file contents, not the URL
    if (!theFirstChars.includes("http")){
      thePlaylist = theURL;
      isPlaylist = 1;
    } else {
      urlToPlay = decodeURIComponent(theURL);
      isPlaylist = 0;
    }
    if (verboseLogging == 1){
      console.log(isPlaylist);
    }
    
    var video = document.getElementById('videoPlayer');

    // ****** HLS/M38U on iOS Safari (in the case, FileMakerGo is iOS Safari bc it uses that browser engine)
    if ((is_iOS == 1 || isSafari()) && theURL.includes("m3u8")){
      if (verboseLogging == 1){
            document.getElementById("playerDebug").innerHTML = "Using Safari native player";
        }
        performFileMakerScript("STATION > Show Now Playing",theStationName);
        video.src = urlToPlay;
        if (verboseLogging == 1){
          console.log(urlToPlay);
          console.log("using Safari native player");
        }
        video.addEventListener('loadedmetadata', function() {
            video.play();
        });
    } 
    // ****** M3U playlist (or M3U Extended), not song list, uses native HTML5 player
    else if (isPlaylist == 1){
        // use the parser
        console.log("Parser");
        if (verboseLogging == 1){
          document.getElementById("playerDebug").innerHTML = "Using M3U Parser";
        }
          //console.log(thePlaylist);
          var playlist = M3U.parse(thePlaylist);
          if (verboseLogging == 1){
            console.log(playlist);
          }
          const audioPlayer = document.getElementById('videoPlayer');
          
          // function to play next track
          function next (audio, playlist, i) {
            if (i < playlist.length) {
              let thisSongName = playlist[i].title;
              let thisArtist = playlist[i].artist;
              let thisURL = playlist[i].file;
              audio.src = playlist[i++].file;

              // Tell us what song is playing
              onNow = thisArtist + " - " + thisSongName;
              //document.getElementById("playlistNowPlaying").innerHTML = onNow;
              
              
              audio.addEventListener("error", function(e) { 
                console.log("Logging playback error: " + e); });

              audio.onended = next.bind(null, audio, playlist, i);
              audio.play();
              performFileMakerScript("STATION > Show Now Playing",onNow);
              if (verboseLogging == 1){
              console.log(thisURL);
              console.log("using HTML5 native player");
              }
            }
          }

          //call the next() function to begin playback
          next(audioPlayer, playlist, 0);
    } 
    // ***** For all other browsers, uses HLS.js to play HLS/M38U if supported
    else if (Hls.isSupported() && theURL.includes("m3u8")) {
        if (verboseLogging == 1){
          document.getElementById("playerDebug").innerHTML = "Using HLS.js";
        }
        performFileMakerScript("STATION > Show Now Playing",theStationName);
        var hls = new Hls();
        if (verboseLogging == 1){
          console.log(urlToPlay);
          console.log("using HLS.js");
          }
        hls.loadSource(urlToPlay);
        hls.attachMedia(video);
        hls.on(Hls.Events.MANIFEST_PARSED, function() {
            video.play();
        });
    } 
    // ***** "Everything else" - it's not a M3U playlist, it's not a HLS/M3U8 playlist, so we use HTML5 native player
    else if (!theURL.includes("m3u8")) { // non-HLS streams? 
      if (verboseLogging == 1){
          document.getElementById("playerDebug").innerHTML = "Non-HLS stream";
      }
        performFileMakerScript("STATION > Show Now Playing",theStationName);
        // for some reason this uses the video tag player anyway... weird!
        if (verboseLogging == 1){
          console.log(urlToPlay);
          console.log("*Everything else* via HTML5 native player");
          }
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