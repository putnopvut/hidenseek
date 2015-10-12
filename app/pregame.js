var Playing = require('./playing');

var Pregame = function(game) {
	this.onStasisStart = function(event, channel) {
		channel.answer(function(err) {
			var room = game.maze.getRandomRoom();
			var joiner = game.addParticipant(channel, event.args[0]);
			console.log('Channel %s entered app', channel.id);
			console.log('Seeker count is now %d and hider count is now %d', game.seekers, game.hiders);
			joiner.playSound(game.ari, 'sound:queue-thereare');
			joiner.playSound(game.ari, 'number:' + joiner.id);
			joiner.playSound(game.ari, 'sound:conf-enteringno');
			game.joinRoom(room, joiner);
		});
	}

	this.onDtmfReceived = function(event, participant) {
		if (event.digit == '*') {
			if (participant.role != 'seeker') {
				console.log('Channel %s wants to start the game but they are not a seeker', participant.channel.id);
				participant.playSound(game.ari, 'sound:beeperr');
				return;
			} else if (game.hiders == 0) {
				console.log('Channel %s wants to start the game but there are no hiders', participant.channel.id);
				participant.playSound(game.ari, 'sound:beeperr');
				return;
			}
			game.webSocketServer.notifyObservers(JSON.stringify({ type: 'game_started' }));
			game.maze.playSoundAll('sound:beep');
			//XXX This transition should probably be less explicit and hidden inside a game state machine.
			game.state = new Playing(game);
		} else {
			console.log('Channel %s pressed DTMF %s but that is invalid in the Pregame state', participant.channel.id, event.digit);
		}
	}
};

module.exports = Pregame;
