'use strict';

var client = require('ari-client');
var room = function(ari, id) {
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
	// Channel unique IDs of occupants
	this.occupants = [];
	// Underlying conference bridge
	this.bridge = ari.Bridge();
	this.bridge.create({type: 'mixing'});
}

function horizontal_link(left_room, right_room) {
	left_room.right = right_room;
	right_room.left = left_room;
}

function vertical_link(up_room, down_room) {
	up_room.down = down_room;
	down_room.up = up_room;
}

// Stub for generating the maze
// For the time being, we will generate the following maze:
// 1 - 2 - 3
//     |   |
//     4 - 5 - 6 - 7      14
//     |       |   |       |
// 8 - 9      10 -11 -12 -13
// |           |   |       |
// 15-16 -17 -18 -19  20 -21
//     |       |           |
//    22      23 -24      25
function generate_rooms(ari) {
	var rooms = [];

	var room1 = new room(ari, 1);
	rooms.push(room1);
	var room2 = new room(ari, 2);
	rooms.push(room2);
	var room3 = new room(ari, 3);
	rooms.push(room3);
	horizontal_link(room1, room2);
	horizontal_link(room2, room3);

	var room4 = new room(ari, 4);
	rooms.push(room4);
	var room5 = new room(ari, 5);
	rooms.push(room5);
	var room6 = new room(ari, 6);
	rooms.push(room6);
	var room7 = new room(ari, 7);
	rooms.push(room7);
	var room14 = new room(ari, 14);
	rooms.push(room14);
	horizontal_link(room4, room5);
	horizontal_link(room5, room6);
	horizontal_link(room6, room7);
	vertical_link(room2, room4);
	vertical_link(room3, room5);

	var room8 = new room(ari, 8);
	rooms.push(room8);
	var room9 = new room(ari, 9);
	rooms.push(room9);
	var room10 = new room(ari, 10);
	rooms.push(room10);
	var room11 = new room(ari, 11);
	rooms.push(room11);
	var room12 = new room(ari, 12);
	rooms.push(room12);
	var room13 = new room(ari, 13);
	rooms.push(room13);
	horizontal_link(room8, room9);
	horizontal_link(room10, room11);
	horizontal_link(room11, room12);
	horizontal_link(room12, room13);
	vertical_link(room4, room9);
	vertical_link(room6, room10);
	vertical_link(room7, room11);
	vertical_link(room14, room13);

	var room15 = new room(ari, 15);
	rooms.push(room15);
	var room16 = new room(ari, 16);
	rooms.push(room16);
	var room17 = new room(ari, 17);
	rooms.push(room17);
	var room18 = new room(ari, 18);
	rooms.push(room18);
	var room19 = new room(ari, 19);
	rooms.push(room19);
	var room20 = new room(ari, 20);
	rooms.push(room20);
	var room21 = new room(ari, 21);
	rooms.push(room21);
	horizontal_link(room15, room16);
	horizontal_link(room16, room17);
	horizontal_link(room17, room18);
	horizontal_link(room18, room19);
	horizontal_link(room20, room21);
	vertical_link(room8, room15);
	vertical_link(room10, room18);
	vertical_link(room11, room19);
	vertical_link(room13, room21);

	var room22 = new room(ari, 22);
	rooms.push(room22);
	var room23 = new room(ari, 23);
	rooms.push(room23);
	var room24 = new room(ari, 24);
	rooms.push(room24);
	var room25 = new room(ari, 25);
	rooms.push(room25);
	horizontal_link(room23, room24);
	vertical_link(room16, room22);
	vertical_link(room18, room23);
	vertical_link(room21, room25);

	return rooms;
}

function get_random_room(rooms) {
	var room_number = Math.floor(Math.random() * (rooms.length));
	return rooms[room_number];
}

client.connect('http://127.0.0.1:8088', 'asterisk', 'asterisk', function(err, ari) {
		var rooms;

		ari.on('StasisStart', function(event, incoming) {
			incoming.answer(function(err) {
				console.log('Channel entered app');
				var room = get_random_room(rooms);
				console.log('Channel entering room %d(bridge %s)', room.id, room.bridge.id);
				room.participants.push(incoming);
			})
		})
		rooms = generate_rooms(ari);
		ari.start('hide-n-seek');
	})
