'use strict';

var client = require('ari-client');

// Stub for generating the maze
function generate_rooms() {
	return;
}

client.connect('http://127.0.0.1:8088', 'asterisk', 'asterisk', function(err, ari) {
		ari.on('StasisStart', function(event, incoming) {
			incoming.answer(function(err) {
				console.log('Channel entered app');
			})
		})
		generate_rooms();
		ari.start('hide-n-seek');
	})
