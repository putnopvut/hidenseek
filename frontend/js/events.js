function onGameMessage(evt) {
  switch (evt.type) {
    case 'leave_room':
      onLeaveRoom(evt);
      break;
    case 'join_room':
      onJoinRoom(evt);
      break;
    case 'catch_attempt':
      onCatchAttempt(evt);
      break;
    case 'hider_caught':
      onHiderCaught(evt);
      break;
    case 'invalid_room_move':
      onInvalidRoomMove(evt);
      break;
    case 'join_game':
      onJoinGame(evt);
      break;
    case 'leave_game':
      onLeaveGame(evt);
      break;
    case 'game_started':
      onGameStarted(evt);
      break;
    case 'game_ended':
      onGameEnded(evt);
      break;
    default:
      console.log('unknown event');
      break;
  }
  updateBoard();
  console.log(players.bob, players.alice);
}

function onLeaveRoom(evt) {
  console.log('onLeaveRoom', evt);
  createjs.Sound.play('leave-room');
  players[evt.channel].room = null;
  players[evt.channel].sprite.visible = false;
}

function onJoinRoom(evt) {
  console.log('onJoinRoom', evt);
  createjs.Sound.play('join-room');
  players[evt.channel].room = evt.room;
  var bounds = players[evt.channel].sprite.getBounds();
  players[evt.channel].sprite.x = roomToX(evt.room) - (bounds.width/2);
  players[evt.channel].sprite.y = roomToY(evt.room) - (bounds.height/2);
  players[evt.channel].sprite.visible = true;
}

function onCatchAttempt(evt) {
  console.log('onCatchAttempt', evt);
  createjs.Sound.play('catch-attempt');
}

function onHiderCaught(evt) {
  console.log('onHiderCaught', evt);
  createjs.Sound.play('hider-caught');
  // switch our hider to a seeker
  var img = document.createElement('img');
  img.src = 'images/seeker.png';
  players[evt.channel].sprite.image = img;
  players[evt.channel].role = 'seeker';
}

function onInvalidRoomMove(evt) {
  console.log('onInvalidRoomMove', evt);
  createjs.Sound.play('invalid-room-move');
}

function onJoinGame(evt) {
  console.log('onJoinGame', evt);
  createjs.Sound.play('join-game');
  var sprite;
  if (evt.role === 'hider') {
    sprite = new createjs.Bitmap('images/hider.png');
  } else {
    sprite = new createjs.Bitmap('images/seeker.png');
  }
  players[evt.channel] = {
    channel: evt.room,
    role: evt.role,
    id: evt.id,
    sprite: sprite
  };
  players[evt.channel].sprite.scaleX = 0.75;
  players[evt.channel].sprite.scaleY = 0.75;
  players[evt.channel].sprite.visible = false;
  
  stage.addChild(players[evt.channel].sprite);
}

function onLeaveGame(evt) {
  console.log('onLeaveGame', evt);
  createjs.Sound.play('leave-game');
  stage.removeChild(players[evt.channel].sprite);
  delete players[evt.channel];
}

function onGameStarted(evt) {
  console.log('onGameStarted', evt);
  createjs.Sound.play('game-started');
}

function onGameEnded(evt) {
  console.log('onGameEnded', evt);
  createjs.Sound.play('game-ended');
}
