'use strict';

var client = require('ari-client');
var Game = require('./app/game');
var express = require('express');

var host = process.env.HOST || 'http://127.0.0.1';
var port = process.env.PORT || '8088';

console.log('connecting to Asterisk on ' + host + ':' + port);
client.connect(host + ':' + port, 'asterisk', 'asterisk')
.then(function(ari) {
	var game;

	function onDtmfReceived(event, channel) {
		var participant = game.participants.filter(function(item) {
			return item.channel.id === channel.id;
		})[0];
		game.state.onDtmfReceived(event, participant);
	}

	function onStasisStart(event, channel) {
		game.state.onStasisStart(event, channel);
		channel.on('ChannelDtmfReceived', onDtmfReceived);
	}

	function onStasisEnd(event, channel) {
		console.log('Channel %s leaving hide and seek', channel.id);
                var participant = game.participants.filter(function(item) {
                        return item.channel.id === channel.id;
                })[0];
		// Drop the respective count
		if (participant.role == 'seeker') {
			game.seekers--;
		} else if (participant.role == 'hider') {
			game.hiders--;
		}
		console.log('Seeker count is now %d and hider count is now %d', game.seekers, game.hiders);
		// It's safe to call joinRoom with a null room, it'll just end up removing it from the one it is in
		game.joinRoom(null, participant);
		game.webSocketServer.notifyObservers(JSON.stringify({ type: 'leave_game', channel: channel.id, id: participant.id, role: participant.role }));
		// Since the channel is going away remove it as a valid participant
		var i = game.participants.indexOf(participant);
		game.participants.splice(i, 1);

		if (game.hiders == 0 || game.seekers == 0) {
			console.log('The game has no hiders or seekers left in it, considering it ended');
			game.webSocketServer.notifyObservers(JSON.stringify({ type: 'game_ended' }));
			game.maze.playSoundAll('sound:beep');
		}
	}

	game = new Game(ari, null);
	ari.on('StasisStart', onStasisStart);
	ari.on('StasisEnd', onStasisEnd);
	ari.start('hide-n-seek');
})
.catch(function (err) {
	console.log(err); // TODO: don't know why this isn't called on invalid host/port
});

var app = express();
app.use(express.static('frontend'));
var webserverPort = process.env.WEBSERVERPORT || 3000;
app.listen(webserverPort, function() {
	console.log('static webserver listening on port ' + webserverPort);
});
