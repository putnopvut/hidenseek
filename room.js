var Room = function(ari, id) {
	// Numerical room ID
	this.id = id;
	// Room to the left
	this.left = null;
	// Room to the right
	this.right = null;
	// Room upward
	this.up = null;
	// Room downward
	this.down = null;
	// Room occupants
	this.occupants = [];
	// Underlying conference bridge
	this.bridge = ari.Bridge();
	this.bridge.create({type: 'mixing,dtmf_events'});
}

module.exports = Room;
