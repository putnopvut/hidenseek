var webSocketServer = require('websocket').server;

var WebSocket = function(game) {
	this.observers = [];

	function onObserverConnect(request) {
		console.log('New observer connection from ' + request.origin);

		var connection = request.accept(null, request.origin);
		connection.on('close', onObserverDisconnect);

		game.observers.push(connection);

		game.participants.forEach(function(participant) {
			connection.sendUTF(JSON.stringify({ type: 'join_game', channel: participant.channel.id, role: participant.role }));
			connection.sendUTF(JSON.stringify({ type: 'join_room', room: participant.room.id, channel: participant.channel.id, role: participant.role }));
		});
	}

	function onObserverDisconnect(connection) {
		console.log('Observer disconnected');

		var i = games.observers.indexOf(connection);
		games.observers.splice(i, 1);
	}

	var server = http.createServer(function(request, response) {
	});
	server.listen(6066, function() {
		console.log('WebSocket server listening on port 6066');
	});

	var wsServer = new webSocketServer({
		httpServer: server
	});
	wsServer.on('request', onObserverConnect);

	this.notify_observers = function(message) {
		this.observers.forEach(function(connection) {
			connection.sendUTF(message);
		});
	}
}

module.exports = WebSocket;
