var ws = new WebSocket("ws://localhost:6066");

ws.onopen = function(evt) {
  console.log('WebSocket connect', evt);
}

ws.onmessage = function(evt) {
  console.log('WebSocket message', evt.data);
  onGameMessage(JSON.parse(evt.data));
}