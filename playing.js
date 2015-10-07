var Playing = function(game) {
	this.onStasisStart = function(event, channel) {
		console.log('Channel %s is trying to enter after the game has started');
		channel.hangup();
	}

	this.onDtmfReceived = function(event, participant) {
		var nextRoom = null;

		if (event.digit == '2') {
			// They want to go up
			console.log('Channel %s wants to move to the room above them', participant.channel.id);
			nextRoom = participant.room.up;
		} else if (event.digit == '8') {
			// They want to go down
			console.log('Channel %s wants to move to the room below them', participant.channel.id);
			nextRoom = participant.room.down;
		} else if (event.digit == '4') {
			// They want to go left
			console.log('Channel %s wants to move to the room to the left of them', participant.channel.id);
			nextRoom = participant.room.left;
		} else if (event.digit == '6') {
			// They want to go right
			console.log('Channel %s wants to move to the room to the right of them', participant.channel.id);
			nextRoom = participant.room.right;
		} else if (event.digit == '0') {
			// They want to grab any hiding participant
			if (participant.role != 'seeker') {
				console.log('Channel %s wants to grab hiders but they are not a seeker', participant.channel.id);
				return;
			}

			console.log('Channel %s is grabbing all hiders in room %d(bridge %s)', participant.channel.id, participant.room.id, participant.room.bridge.id);

			game.webSocketServer.notify_observers(JSON.stringify({ type: 'catch_attempt', room: participant.room.id, channel: participant.channel.id, id: participant.id }));

			participant.room.occupants.forEach(function(item) {
				if (item.role != 'hider') {
					return;
				}
				console.log('Channel %s was caught by %s, they are now a seeker', item.id, item.channel.id);
				game.hiders--;
				game.seekers++;
				item.role = 'seeker';
				game.webSocketServer.notify_observers(JSON.stringify({ type: 'hider_caught', room: participant.room.id, channel: item.channel.id, id: item.id }));
			});

			console.log('Seeker count is now %d and hider count is now %d', game.seekers, game.hiders);

			if (game.hiders == 0) {
				// All the hiders are gone, the game can end
				console.log('The game has no hiders left in it, considering it ended');
				game.webSocketServer.notify_observers(JSON.stringify({ type: 'game_ended' }));
				game.maze.play_sound_all('sound:beeperr');
				//XXX Transition to next state (Maybe allocate a new game and go back to pregame?)
			} else {
				participant.room.bridge.play({media: 'sound:beep'});
			}

			return;
		}

		if (nextRoom == null) {
			console.log('Channel %s tried to move in a direction where no room exists', participant.channel.id);
			participant.play_sound(game.ari, 'sound:oops1');
			game.webSocketServer.notify_observers(JSON.stringify({ type: 'invalid_room_move', room: participant.room.id, channel: participant.channel.id, id: participant.id, direction: event.digit }));
			return;
		}

		game.joinRoom(nextRoom, participant);
	}
};

module.exports = Playing;
