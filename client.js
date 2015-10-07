'use strict';

var client = require('ari-client');
var webSocketServer = require('websocket').server;
var http = require('http');
var Maze = require('./maze');
var Participant = require('./participant');
var Pregame = require('./pregame');

var Game = function(ari) {
	this.ari = ari;
	this.participants = [];
	this.participant_id = 1;
	this.hiders = 0;
	this.seekers = 0;
	this.state = new Pregame(this);
	this.maze = new Maze(ari);
	this.observers = []

	this.add_participant = function(channel, role) {
		var participant = new Participant(channel, role, this.participant_id++);
		if (role == 'seeker') {
			this.seekers++;
		} else if (role == 'hider') {
			this.hiders++;
		}
		this.participants.push(participant);
		this.notify_observers(JSON.stringify({ type: 'join_game', channel: channel.id, id: participant.id, role: participant.role }));

		return participant;
	}

	this.joinRoom = function(room, participant) {
		if (participant.room) {
			console.log('Channel %s leaving room %d(bridge %s)', participant.channel.id, participant.room.id, participant.room.bridge.id);
			var i = participant.room.occupants.indexOf(participant);
			participant.room.occupants.splice(i, 1);
			if (participant.role == 'seeker') {
				participant.room.bridge.play({media: 'sound:confbridge-leave'});
			}
			this.notify_observers(JSON.stringify({ type: 'leave_room', room: participant.room.id, channel: participant.channel.id, id: participant.id, role: participant.role }));
		}
		participant.room = room;
		if (room) {
			console.log('Channel %s entering room %d(bridge %s) as %s', participant.channel.id, room.id, room.bridge.id, participant.role);
			room.occupants.push(participant);
			// addChannel will move the channel as appropriate, we don't need to explicitly remove
			if (participant.role == 'seeker') {
				room.bridge.play({media: 'sound:confbridge-join'});
			}
			room.bridge.addChannel({channel: participant.channel.id});
			participant.play_sound(ari, 'number:' + room.id);
			this.notify_observers(JSON.stringify({ type: 'join_room', room: participant.room.id, channel: participant.channel.id, id: participant.id, role: participant.role }));
		}
	}

	this.notify_observers = function(message) {
		this.observers.forEach(function(connection) {
			connection.sendUTF(message);
		});
	}
};

client.connect('http://127.0.0.1:8088', 'asterisk', 'asterisk', function(err, ari) {
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
		game.notify_observers(JSON.stringify({ type: 'leave_game', channel: channel.id, id: participant.id, role: participant.role }));
		// Since the channel is going away remove it as a valid participant
		var i = game.participants.indexOf(participant);
		game.participants.splice(i, 1);

		if (game.hiders == 0 || game.seekers == 0) {
			console.log('The game has no hiders or seekers left in it, considering it ended');
			game.notify_observers(JSON.stringify({ type: 'game_ended' }));
			game.maze.play_sound_all('sound:beep');
		}
	}

	function onObserverConnect(request) {
		console.log('New observer connection from ' + request.origin);

		var connection = request.accept(null, request.origin);
		connection.on('close', onObserverDisconnect);

		game.observers.push(connection);

		game.participants.forEach(function(participant) {
			connection.sendUTF(JSON.stringify({ type: 'join_game', channel: participant.channel.id, role: participant.role }));
			connection.sendUTF(JSON.stringify({ type: 'join_room', room: participant.room.id, channel: participant.channel.id, role: participant.role }));
		});
	}

	function onObserverDisconnect(connection) {
		console.log('Observer disconnected');

		var i = games.observers.indexOf(connection);
		games.observers.splice(i, 1);
	}

	var server = http.createServer(function(request, response) {
	});
	server.listen(6066, function() {
		console.log('WebSocket server listening on port 6066');
	});

	var wsServer = new webSocketServer({
		httpServer: server
	});
	wsServer.on('request', onObserverConnect);

	game = new Game(ari);
	ari.on('StasisStart', onStasisStart);
	ari.on('StasisEnd', onStasisEnd);
	ari.start('hide-n-seek');
})
.catch(function (err) {
	console.log(err);
});
