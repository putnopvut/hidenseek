var Room = require('./room');

function horizontal_link(left_room, right_room) {
	left_room.right = right_room;
	right_room.left = left_room;
}

function vertical_link(up_room, down_room) {
	up_room.down = down_room;
	down_room.up = up_room;
}

var Maze = function(ari) {
	this.rooms = [];

	var room1 = new Room(ari, 1);
	this.rooms.push(room1);
	var room2 = new Room(ari, 2);
	this.rooms.push(room2);
	var room3 = new Room(ari, 3);
	this.rooms.push(room3);
	horizontal_link(room1, room2);
	horizontal_link(room2, room3);

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
	horizontal_link(room4, room5);
	horizontal_link(room5, room6);
	horizontal_link(room6, room7);
	vertical_link(room2, room4);
	vertical_link(room3, room5);

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
	horizontal_link(room8, room9);
	horizontal_link(room10, room11);
	horizontal_link(room11, room12);
	horizontal_link(room12, room13);
	vertical_link(room4, room9);
	vertical_link(room6, room10);
	vertical_link(room7, room11);
	vertical_link(room14, room13);

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
	horizontal_link(room15, room16);
	horizontal_link(room16, room17);
	horizontal_link(room17, room18);
	horizontal_link(room18, room19);
	horizontal_link(room20, room21);
	vertical_link(room8, room15);
	vertical_link(room10, room18);
	vertical_link(room11, room19);
	vertical_link(room13, room21);

	var room22 = new Room(ari, 22);
	this.rooms.push(room22);
	var room23 = new Room(ari, 23);
	this.rooms.push(room23);
	var room24 = new Room(ari, 24);
	this.rooms.push(room24);
	var room25 = new Room(ari, 25);
	this.rooms.push(room25);
	horizontal_link(room23, room24);
	vertical_link(room16, room22);
	vertical_link(room18, room23);
	vertical_link(room21, room25);

	this.get_random_room = function() {
		var room_number = Math.floor(Math.random() * (this.rooms.length));
		return this.rooms[room_number];
	}

	this.play_sound_all = function(sound) {
		this.rooms.forEach(function(room) {
			if (room.occupants.length > 0) {
				room.bridge.play({media: sound});
			}
		});
	}
};

module.exports = Maze;
