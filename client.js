'use strict';

var client = require('ari-client');
var Maze = require('./app/maze');
var Participant = require('./app/participant');
var Pregame = require('./app/pregame');
var WebSocket = require('./app/ws');

var host = process.env.HOST || 'http://127.0.0.1';
var port = process.env.PORT || '8088';

var Game = function(ari) {
	this.ari = ari;
	this.participants = [];
	this.participant_id = 1;
	this.hiders = 0;
	this.seekers = 0;
	this.state = new Pregame(this);
	this.maze = new Maze(ari);

	this.webSocketServer = new WebSocket();

	this.add_participant = function(channel, role) {
		var participant = new Participant(channel, role, this.participant_id++);
		if (role == 'seeker') {
			this.seekers++;
		} else if (role == 'hider') {
			this.hiders++;
		}
		this.participants.push(participant);
		this.webSocketServer.notify_observers(JSON.stringify({ type: 'join_game', channel: channel.id, id: participant.id, role: participant.role }));

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
			this.webSocketServer.notify_observers(JSON.stringify({ type: 'leave_room', room: participant.room.id, channel: participant.channel.id, id: participant.id, role: participant.role }));
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
			this.webSocketServer.notify_observers(JSON.stringify({ type: 'join_room', room: participant.room.id, channel: participant.channel.id, id: participant.id, role: participant.role }));
		}
	}
};

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
		game.webSocketServer.notify_observers(JSON.stringify({ type: 'leave_game', channel: channel.id, id: participant.id, role: participant.role }));
		// Since the channel is going away remove it as a valid participant
		var i = game.participants.indexOf(participant);
		game.participants.splice(i, 1);

		if (game.hiders == 0 || game.seekers == 0) {
			console.log('The game has no hiders or seekers left in it, considering it ended');
			game.webSocketServer.notify_observers(JSON.stringify({ type: 'game_ended' }));
			game.maze.play_sound_all('sound:beep');
		}
	}

	game = new Game(ari);
	ari.on('StasisStart', onStasisStart);
	ari.on('StasisEnd', onStasisEnd);
	ari.start('hide-n-seek');
})
.catch(function (err) {
	console.log(err); // TODO: don't know why this isn't called on invalid host/port
});
