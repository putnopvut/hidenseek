var Pregame = require('./pregame');
var Maze = require('./maze');
var Participant = require('./participant');
var WebSocket = require('./ws');

var Game = function(ari) {
  this.ari = ari;
  this.participants = [];
  this.participantID = 1;
  this.hiders = 0;
  this.seekers = 0;
  this.state = new Pregame(this);
  this.maze = new Maze(ari);

  this.webSocketServer = new WebSocket(this);

  this.addParticipant = function(channel, role) {
    var participant = new Participant(channel, role, this.participantID++);
    if (role == 'seeker') {
      this.seekers++;
    } else if (role == 'hider') {
      this.hiders++;
    }
    this.participants.push(participant);
    this.webSocketServer.notifyObservers(JSON.stringify({ type: 'join_game', channel: channel.id, id: participant.id, role: participant.role }));

    return participant;
  }

  this.joinRoom = function(room, participant) {
    if (participant.room) {
      console.log('Channel %s leaving room %d(bridge %s)', participant.channel.id, participant.room.id, participant.room.bridge.id);
      var i = participant.room.occupants.indexOf(participant);
      participant.room.occupants.splice(i, 1);
      if (participant.role == 'seeker') {
        participant.room.bridge.play({media: 'sound:confbridge-leave'});
      }
      this.webSocketServer.notifyObservers(JSON.stringify({ type: 'leave_room', room: participant.room.id, channel: participant.channel.id, id: participant.id, role: participant.role }));
    }
    participant.room = room;
    if (room) {
      console.log('Channel %s entering room %d(bridge %s) as %s', participant.channel.id, room.id, room.bridge.id, participant.role);
      room.occupants.push(participant);
      // addChannel will move the channel as appropriate, we don't need to explicitly remove
      if (participant.role == 'seeker') {
        room.bridge.play({media: 'sound:confbridge-join'});
      }
      room.bridge.addChannel({channel: participant.channel.id});
      participant.playSound(ari, 'number:' + room.id);
      this.webSocketServer.notifyObservers(JSON.stringify({ type: 'join_room', room: participant.room.id, channel: participant.channel.id, id: participant.id, role: participant.role }));
    }
  }

  this.end = function() {
	  for (var i = 0; i < this.participants.length; i++) {
		  this.participants[i].channel.hangup();
	  }
	  this.maze.end();
  }
};

module.exports = Game;
