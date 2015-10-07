# hidenseek
Asterisk ARI Hide 'n' Seek

This provides a simple Hide 'n' Seek game that demonstrates the Asterisk Rest Interface (ARI) in a fun way.

# Installation
This game has two dependencies, the "websocket" and "ari-client" npm modules. To install these, simply run the following
from your command line.
````
npm install websocket
npm install ari-client
````

# Asterisk configuration
In order to use ARI applications, you will need to enable Asterisk's HTTP server, as well as enabling ARI. A simple
http.conf file you can use would be the following
````
[general]
enabled = yes
bindaddr = 0.0.0.0
bindport = 8088
````
A simple ari.conf file you can use would be the following
````
[general]
enabled = yes
allowed_origins = *
[asterisk]
type = user
password = asterisk
````
Note that the code in the hide 'n' seek application has the built-in assumption that they can use ARI as user "asterisk"
with password "asterisk". If you wish to use a different username and password combination, you will need to set ari.conf
to use your desired username and password, and alter the ````client.connect()``` line in client.js to use the appropriate
HTTP URI, username and password you would like.

Once you have ARI configured, you will need to provide a way for incoming calls to reach your ARI application. The
application name is "hide-n-seek". It is suggested that you provide two entry points to the application, one for hiders
and one for seekers. The following is a suggested dialplan:
````
[default]
exten => 500,1,NoOp()
same => n,Stasis(hide-n-seek,hider)
same => n,Hangup()

exten => 501,1,NoOp()
same => n,Stasis(hide-n-seek,seeker)
same => n,Hangup()
````
With this setup, callers who dial 500 will be hiders, and callers who dial 501 will be seekers.

# Running the application
Once you have Asterisk configured, and you have the prerequisites installed, running the app simply requires you to start
Asterisk, and then run
````
./client.js
````
from your checkout of this repo. The client will connect to Asterisk and will be ready to accept incoming calls. Enjoy!
