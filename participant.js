var Participant = function(channel, role, id) {
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

	this.play_sound = function(ari, sound) {
		var participant = this;
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
}
module.exports = Participant;
