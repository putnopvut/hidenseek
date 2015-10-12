var Room = require('./room');

function horizontalLink(leftRoom, rightRoom) {
	leftRoom.right = rightRoom;
	rightRoom.left = leftRoom;
}

function verticalLink(upRoom, downRoom) {
	upRoom.down = downRoom;
	downRoom.up = upRoom;
}

var Maze = function(ari) {
	this.rooms = [];

	var room1 = new Room(ari, 1);
	this.rooms.push(room1);
	var room2 = new Room(ari, 2);
	this.rooms.push(room2);
	var room3 = new Room(ari, 3);
	this.rooms.push(room3);
	horizontalLink(room1, room2);
	horizontalLink(room2, room3);

	var room4 = new Room(ari, 4);
	this.rooms.push(room4);
	var room5 = new Room(ari, 5);
	this.rooms.push(room5);
	var room6 = new Room(ari, 6);
	this.rooms.push(room6);
	var room7 = new Room(ari, 7);
	this.rooms.push(room7);
	var room14 = new Room(ari, 14);
	this.rooms.push(room14);
	horizontalLink(room4, room5);
	horizontalLink(room5, room6);
	horizontalLink(room6, room7);
	verticalLink(room2, room4);
	verticalLink(room3, room5);

	var room8 = new Room(ari, 8);
	this.rooms.push(room8);
	var room9 = new Room(ari, 9);
	this.rooms.push(room9);
	var room10 = new Room(ari, 10);
	this.rooms.push(room10);
	var room11 = new Room(ari, 11);
	this.rooms.push(room11);
	var room12 = new Room(ari, 12);
	this.rooms.push(room12);
	var room13 = new Room(ari, 13);
	this.rooms.push(room13);
	horizontalLink(room8, room9);
	horizontalLink(room10, room11);
	horizontalLink(room11, room12);
	horizontalLink(room12, room13);
	verticalLink(room4, room9);
	verticalLink(room6, room10);
	verticalLink(room7, room11);
	verticalLink(room14, room13);

	var room15 = new Room(ari, 15);
	this.rooms.push(room15);
	var room16 = new Room(ari, 16);
	this.rooms.push(room16);
	var room17 = new Room(ari, 17);
	this.rooms.push(room17);
	var room18 = new Room(ari, 18);
	this.rooms.push(room18);
	var room19 = new Room(ari, 19);
	this.rooms.push(room19);
	var room20 = new Room(ari, 20);
	this.rooms.push(room20);
	var room21 = new Room(ari, 21);
	this.rooms.push(room21);
	horizontalLink(room15, room16);
	horizontalLink(room16, room17);
	horizontalLink(room17, room18);
	horizontalLink(room18, room19);
	horizontalLink(room20, room21);
	verticalLink(room8, room15);
	verticalLink(room10, room18);
	verticalLink(room11, room19);
	verticalLink(room13, room21);

	var room22 = new Room(ari, 22);
	this.rooms.push(room22);
	var room23 = new Room(ari, 23);
	this.rooms.push(room23);
	var room24 = new Room(ari, 24);
	this.rooms.push(room24);
	var room25 = new Room(ari, 25);
	this.rooms.push(room25);
	horizontalLink(room23, room24);
	verticalLink(room16, room22);
	verticalLink(room18, room23);
	verticalLink(room21, room25);

	this.getRandomRoom = function() {
		var roomNumber = Math.floor(Math.random() * (this.rooms.length));
		return this.rooms[roomNumber];
	}

	this.playSoundAll = function(sound) {
		this.rooms.forEach(function(room) {
			if (room.occupants.length > 0) {
				room.bridge.play({media: sound});
			}
		});
	}
};

module.exports = Maze;
