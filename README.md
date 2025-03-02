# FMRadio
Streaming audio app in FileMaker using JavaScript.

I started building this because I didn't really like any of the iOS or self-hosted music apps (they either have a UI I don't like or there's a subscription, or they don't easly let me curate, etc). In the time honoured tradition of learning by "scratching an itch" I decided to make my own. I'm still learning JavaScript and re-learning HTML after 25+ years, so this is a nice project to do that with.

# Currently Working:
Can play streams, HLS and AAC defintely working, others should too

Basic player/station selector mobile UI

Settings/station management via FileMaker Pro


# Short term To-Do:
Station add/edit mobile UI **DONE**

App settings mobile UI **DONE**

Make the JS player prettier

Add some pre-baked station lists to import


# Long Term To-Do:
Control the JS player via FileMaker Perform Javascript + stop/pause functions in the JS

More to come!

# Errata
The HTML and Javascript are embedded in the fmp12 file, but are provided separately in the resources directory as well for version control / ease of editing

The username/password is admin/password - FileMaker Server requires a password for files so it's already there if you want to host it on FMS

The JS pulls in HLS.js which is (c) DailyMotion and licensed under the Apache 2.0 license.
