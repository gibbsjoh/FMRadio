# FMRadio
Streaming audio app in FileMaker using JavaScript.

I started building this because I didn't really like any of the iOS or self-hosted music apps (they either have a UI I don't like or there's a subscription, or they don't easly let me curate, etc). In the time honoured tradition of learning by "scratching an itch" I decided to make my own. I'm still learning JavaScript and re-learning HTML after 25+ years, so this is a nice project to do that with.

# Goals

Multi-platform - specifically I wanted something that'll work on my Windows Phone, but the goal is to support FileMaker Go on iOS/iPadOS, web on other platforms.

Ability to add custom playlists

Ability to add/remove internet radio stations

Some facility to import pre-canned station lists from the internet.

# Currently Working:
Can play streams, HLS and AAC defintely working, others should too

Basic player/station selector mobile UI

Settings/station management via FileMaker Pro

Station add/edit mobile UI

App settings mobile UI

Control the JS player via FileMaker Perform Javascript + stop/pause functions in the JS [sort of WIP]


# Short term To-Do:

Make the JS player prettier

Add some pre-baked station lists to import

Make the FM UI look/work better


# Long Term To-Do:

More to come!

# Errata
The HTML and Javascript are embedded in the fmp12 file, but are provided separately in the resources directory as well for version control / ease of editing

The username/password is admin/password - FileMaker Server requires a password for files so it's already there if you want to host it on FMS

The JS pulls in:

HLS.js which is (c) DailyMotion and licensed under the Apache 2.0 license. https://github.com/video-dev/hls.js/

javascript-playlist-parser by Nick Desaulniers https://github.com/nickdesaulniers/javascript-playlist-parser
