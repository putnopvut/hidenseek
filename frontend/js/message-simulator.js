if (localStorage.simulate) {

var messages = [

  function() {
    onGameMessage({
      type: 'game_started'
    })
  },

  function () {
    onGameMessage({
      type: 'join_game',
      channel: 'bob',
      id: '1',
      role: 'hider' 
    })
  },

  function() {
    onGameMessage({
      type: 'join_room',
      room: '1',
      channel: 'bob',
      role: 'hider' 
    })
  },

  function() {
    onGameMessage({
      type: 'leave_room',
      room: '1',
      channel: 'bob',
      role: 'hider' 
    })
  },

  function() {
    onGameMessage({
      type: 'join_room',
      room: '2',
      channel: 'bob',
      role: 'hider' 
    })
  },

  function () {
    onGameMessage({
      type: 'join_game',
      channel: 'alice',
      id: '2',
      role: 'seeker' 
    })
  },

  function() {
    onGameMessage({
      type: 'join_room',
      room: '13',
      channel: 'alice',
      role: 'seeker' 
    })
  },

  function() {
    onGameMessage({
      type: 'leave_room',
      room: '2',
      channel: 'bob',
      role: 'hider' 
    })
  },

  function() {
    onGameMessage({
      type: 'join_room',
      room: '3',
      channel: 'bob',
      role: 'hider' 
    })
  },

  function() {
    onGameMessage({
      type: 'leave_room',
      room: '13',
      channel: 'alice',
      role: 'seeker' 
    })
  },

  function() {
    onGameMessage({
      type: 'join_room',
      room: '12',
      channel: 'alice',
      role: 'seeker' 
    })
  },

  function() {
    onGameMessage({
      type: 'leave_room',
      room: '3',
      channel: 'bob',
      role: 'hider' 
    })
  },

  function() {
    onGameMessage({
      type: 'join_room',
      room: '5',
      channel: 'bob',
      role: 'hider' 
    })
  },

  function() {
    onGameMessage({
      type: 'leave_room',
      room: '12',
      channel: 'alice',
      role: 'seeker' 
    })
  },

  function() {
    onGameMessage({
      type: 'join_room',
      room: '11',
      channel: 'alice',
      role: 'seeker' 
    })
  },

  function() {
    onGameMessage({
      type: 'leave_room',
      room: '11',
      channel: 'alice',
      role: 'seeker' 
    })
  },

  function() {
    onGameMessage({
      type: 'join_room',
      room: '10',
      channel: 'alice',
      role: 'seeker' 
    })
  },

  function() {
    onGameMessage({
      type: 'leave_room',
      room: '10',
      channel: 'alice',
      role: 'seeker' 
    })
  },

  function() {
    onGameMessage({
      type: 'invalid_room_move',
      room: '8',
      channel: 'alice',
      direction: 'up' 
    })
  },

  function() {
    onGameMessage({
      type: 'join_room',
      room: '6',
      channel: 'alice',
      role: 'seeker' 
    })
  },

  function() {
    onGameMessage({
      type: 'catch_attempt',
      room: '5',
      channel: 'alice'
    })
  },

  function() {
    onGameMessage({
      type: 'leave_room',
      room: '6',
      channel: 'alice',
      role: 'seeker' 
    })
  },

  function() {
    onGameMessage({
      type: 'join_room',
      room: '5',
      channel: 'alice',
      role: 'seeker' 
    })
  },

  function() {
    onGameMessage({
      type: 'catch_attempt',
      room: '5',
      channel: 'alice'
    })
  },

  function() {
    onGameMessage({
      type: 'hider_caught',
      room: '5',
      channel: 'bob'
    })
  },


  function() {
    onGameMessage({
      type: 'leave_game',
      channel: 'bob',
      role: 'hider' 
    })
  },

  function() {
    onGameMessage({
      type: 'leave_game',
      channel: 'alice',
      role: 'seeker' 
    })
  },

  function() {
    onGameMessage({
      type: 'game_ended'
    })
  }
];

var timer = setInterval(function() {
  var message = messages.shift();
  if (message) {
    message();
  } else {
    clearInterval(timer);
  }
}, 1000);

}
