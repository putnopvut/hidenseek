'use strict';

var client = require('ari-client');
var webSocketServer = require('websocket').server;
var http = require('http');
var Maze = require('./maze');

var participant = function(channel, role, id) {
	// Channel for the participant
	this.channel = channel;
	// Role of the participant
	this.role = role;
	// Numerical identifier of the participant
	this.id = id;
	// Room the participant is currently in
	this.room = null;
	// Playback queue
	this.playbacks = [];
}

function play_sound(ari, participant, sound) {
	participant.playbacks.push(sound);

	function onPlaybackFinished() {
		var played = participant.playbacks.shift();

		console.log('Completed playing %s on channel %s', played, participant.channel.id);

		var prompt = participant.playbacks[0];

		if (prompt == null) {
			console.log('Playback queue on channel %s is now empty', participant.channel.id);
			return;
		}

		console.log('Playing %s on channel %s', prompt, participant.channel.id);
		participant.channel.play({media: prompt})
			.then(function (playback) {
				playback.on('PlaybackFinished', onPlaybackFinished);
			});
	}

	// If this is the first thing in the queue start playing it back
	// Otherwise it'll play in order once the current thing finishes
	if (participant.playbacks.length == 1) {
		console.log('Playing initial sound %s on channel %s', sound, participant.channel.id);
                participant.channel.play({media: sound})
                        .then(function (playback) {
                                playback.on('PlaybackFinished', onPlaybackFinished);
                        });
	} else {
		console.log('Something is already playing on channel %s, adding %s to queue', participant.channel.id, sound);
	}
}

function notify_observers(observers, message) {
	observers.forEach(function(connection) {
		connection.sendUTF(message);
	});
}

client.connect('http://127.0.0.1:8088', 'asterisk', 'asterisk', function(err, ari) {
	var maze;
	var participants = [];
	var observers = [];
	var hiders = 0;
	var seekers = 0;
	var participant_id = 1;

	function joinRoom(room, participant) {
		if (participant.room) {
			console.log('Channel %s leaving room %d(bridge %s)', participant.channel.id, participant.room.id, participant.room.bridge.id);
			var i = participant.room.occupants.indexOf(participant);
			participant.room.occupants.splice(i, 1);
			if (participant.role == 'seeker') {
				participant.room.bridge.play({media: 'sound:confbridge-leave'});
			}
			notify_observers(observers, JSON.stringify({ type: 'leave_room', room: participant.room.id, channel: participant.channel.id, id: participant.id, role: participant.role }));
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
			play_sound(ari, participant, 'number:' + room.id);
			notify_observers(observers, JSON.stringify({ type: 'join_room', room: participant.room.id, channel: participant.channel.id, id: participant.id, role: participant.role }));
		}
	}

	function onDtmfReceived(event, channel) {
		var participant = participants.filter(function(item) {
			return item.channel.id === channel.id;
		})[0];
		var nextRoom = null;

		if (event.digit == '*') {
			if (participant.role != 'seeker') {
				console.log('Channel %s wants to start the game but they are not a seeker', channel.id);
				play_sound(ari, participant, 'sound:beeperr');
				return;
			} else if (hiders == 0) {
				console.log('Channel %s wants to start the game but there are no hiders', channel.id);
				play_sound(ari, participant, 'sound:beeperr');
				return;
			}
			notify_observers(observers, JSON.stringify({ type: 'game_started' }));
			maze.play_sound_all('sound:beep');
		} else if (event.digit == '2') {
			// They want to go up
			console.log('Channel %s wants to move to the room above them', channel.id);
			nextRoom = participant.room.up;
		} else if (event.digit == '8') {
			// They want to go down
			console.log('Channel %s wants to move to the room below them', channel.id);
			nextRoom = participant.room.down;
		} else if (event.digit == '4') {
			// They want to go left
			console.log('Channel %s wants to move to the room to the left of them', channel.id);
			nextRoom = participant.room.left;
		} else if (event.digit == '6') {
			// They want to go right
			console.log('Channel %s wants to move to the room to the right of them', channel.id);
			nextRoom = participant.room.right;
		} else if (event.digit == '0') {
			// They want to grab any hiding participant
			if (participant.role != 'seeker') {
				console.log('Channel %s wants to grab hiders but they are not a seeker', channel.id);
				return;
			}

			console.log('Channel %s is grabbing all hiders in room %d(bridge %s)', channel.id, participant.room.id, participant.room.bridge.id);

			notify_observers(observers, JSON.stringify({ type: 'catch_attempt', room: participant.room.id, channel: participant.channel.id, id: participant.id }));

			participant.room.occupants.forEach(function(item) {
				if (item.role != 'hider') {
					return;
				}
				console.log('Channel %s was caught by %s, they are now a seeker', item.id, channel.id);
				hiders--;
				seekers++;
				item.role = 'seeker';
				notify_observers(observers, JSON.stringify({ type: 'hider_caught', room: participant.room.id, channel: item.channel.id, id: item.id }));
			});

			console.log('Seeker count is now %d and hider count is now %d', seekers, hiders);

			if (hiders == 0) {
				// All the hiders are gone, the game can end
				console.log('The game has no hiders left in it, considering it ended');
				notify_observers(observers, JSON.stringify({ type: 'game_ended' }));
				maze.play_sound_all('sound:beeperr');
			} else {
				participant.room.bridge.play({media: 'sound:beep'});
			}

			return;
		} else {
			console.log('Channel %s tried to use invalid DTMF digit %s', channel.id, event.digit);
			return;
		}

		if (nextRoom == null) {
			console.log('Channel %s tried to move in a direction where no room exists', channel.id);
			play_sound(ari, participant, 'sound:oops1');
			notify_observers(observers, JSON.stringify({ type: 'invalid_room_move', room: participant.room.id, channel: participant.channel.id, id: participant.id, direction: event.digit }));
			return;
		}

		joinRoom(nextRoom, participant);
	}

	function onStasisStart(event, channel) {
		channel.answer(function(err) {
			var room = maze.get_random_room();
			var joiner = new participant(channel, event.args[0], participant_id++);
			console.log('Channel %s entered app', channel.id);
			channel.on('ChannelDtmfReceived', onDtmfReceived);
			if (joiner.role == 'seeker') {
				seekers++;
			} else if (joiner.role == 'hider') {
				hiders++;
			}
			console.log('Seeker count is now %d and hider count is now %d', seekers, hiders);
			play_sound(ari, joiner, 'sound:queue-thereare');
			play_sound(ari, joiner, 'number:' + joiner.id);
			participants.push(joiner);
			notify_observers(observers, JSON.stringify({ type: 'join_game', channel: channel.id, id: joiner.id, role: joiner.role }));
			play_sound(ari, joiner, 'sound:conf-enteringno');
			joinRoom(room, joiner);
		});
	}

	function onStasisEnd(event, channel) {
		console.log('Channel %s leaving hide and seek', channel.id);
                var participant = participants.filter(function(item) {
                        return item.channel.id === channel.id;
                })[0];
		// Drop the respective count
		if (participant.role == 'seeker') {
			seekers--;
		} else if (participant.role == 'hider') {
			hiders--;
		}
		console.log('Seeker count is now %d and hider count is now %d', seekers, hiders);
		// It's safe to call joinRoom with a null room, it'll just end up removing it from the one it is in
		joinRoom(null, participant);
		notify_observers(observers, JSON.stringify({ type: 'leave_game', channel: channel.id, id: participant.id, role: participant.role }));
		// Since the channel is going away remove it as a valid participant
		var i = participants.indexOf(participant);
		participants.splice(i, 1);

		if (hiders == 0 || seekers == 0) {
			console.log('The game has no hiders or seekers left in it, considering it ended');
			notify_observers(observers, JSON.stringify({ type: 'game_ended' }));
			maze.play_sound_all('sound:beep');
		}
	}

	function onObserverConnect(request) {
		console.log('New observer connection from ' + request.origin);

		var connection = request.accept(null, request.origin);
		connection.on('close', onObserverDisconnect);

		observers.push(connection);

		participants.forEach(function(participant) {
			connection.sendUTF(JSON.stringify({ type: 'join_game', channel: participant.channel.id, role: participant.role }));
			connection.sendUTF(JSON.stringify({ type: 'join_room', room: participant.room.id, channel: participant.channel.id, role: participant.role }));
		});
	}

	function onObserverDisconnect(connection) {
		console.log('Observer disconnected');

		var i = observers.indexOf(connection);
		observers.splice(i, 1);
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

	maze = new Maze(ari);
	ari.on('StasisStart', onStasisStart);
	ari.on('StasisEnd', onStasisEnd);
	ari.start('hide-n-seek');
})
.catch(function (err) {
	console.log(err);
});
