var Ending = function(game) {
	this.onStasisStart = function(event, channel) {
		console.log('Channel %s is trying to enter after the game has ended', channel.id);
		channel.hangup();
	}
	this.onDtmfReceived = function(event, participant) {
		// Just ignore
		return;
	}

	this.game.end();
}

module.exports = Ending;
