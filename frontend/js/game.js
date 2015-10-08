var CELL_WIDTH = 100;
var CELL_HEIGHT = 100;
var rooms = [];
var players = {};
var stage;
var mazeMap = [
    {column: 0, row: 0}, //1
    {column: 1, row: 0}, //2
    {column: 2, row: 0}, //3
    {column: 1, row: 1}, //4
    {column: 2, row: 1}, //5
    {column: 3, row: 1}, //6
    {column: 4, row: 1}, //7
    {column: 0, row: 2}, //8
    {column: 1, row: 2}, //9
    {column: 3, row: 2}, //10
    {column: 4, row: 2}, //11
    {column: 5, row: 2}, //12
    {column: 6, row: 2}, //13
    {column: 6, row: 1}, //14
    {column: 0, row: 3}, //15
    {column: 1, row: 3}, //16
    {column: 2, row: 3}, //17
    {column: 3, row: 3}, //18
    {column: 4, row: 3}, //19
    {column: 5, row: 3}, //20
    {column: 6, row: 3}, //21
    {column: 1, row: 4}, //22
    {column: 3, row: 4}, //23
    {column: 4, row: 4}, //24
    {column: 6, row: 4}, //25
];
var roomLinks = [
    [1, 2],
    [2, 3],
    [2, 3],
    [3, 5],
    [4, 5],
    [5, 6],
    [6, 7],
    [14, 13],
    [8, 9],
    [4, 9],
    [6, 10],
    [7, 11],
    [10, 11],
    [11, 12],
    [12, 13],
    [8, 15],
    [10, 18],
    [11, 19],
    [15, 16],
    [16, 17],
    [17, 18],
    [18, 19],
    [20, 21],
    [13, 21],
    [16, 22],
    [18, 23],
    [23, 24],
    [21, 25],
];

function init() {
    console.log('init()')
    stage = new createjs.Stage("demoCanvas");

/*
    var line = new createjs.Shape();
    stage.addChild(line);
    line.graphics.setStrokeStyle(1).beginStroke("#000000");
    line.graphics.moveTo(10, 10).setStrokeStyle(1).beginStroke("red").lineTo(10, 400);
    line.graphics.endStroke();
    stage.update();

    var line = new createjs.Shape();
    stage.addChild(line);
    line.graphics.setStrokeStyle(1).beginStroke("rgba(0,0,0,1)");
    line.graphics.moveTo(120, 30);
    line.graphics.lineTo(280, 30);
    line.graphics.endStroke();
    stage.update();
*/

    drawMaze(stage);
    loadSounds();

}

function drawMaze(stage) {
    console.log('drawMaze()', stage);

    // draw the links between rooms
    roomLinks.forEach(function(link) {
        //console.log('drawing link for', link);

        var startPoint = {
            x: (mazeMap[link[0]-1].column * CELL_WIDTH) + (CELL_WIDTH/2),
            y: (mazeMap[link[0]-1].row * CELL_HEIGHT) + (CELL_HEIGHT/2)
        };
        var endPoint = {
            x: (mazeMap[link[1]-1].column * CELL_WIDTH) + (CELL_WIDTH/2),
            y: (mazeMap[link[1]-1].row * CELL_HEIGHT) + (CELL_HEIGHT/2)
        };

        var line = new createjs.Shape();
        stage.addChild(line);
        line.graphics.setStrokeStyle(8).beginStroke("rgba(0,0,0,1)");
        line.graphics.moveTo(startPoint.x, startPoint.y).lineTo(endPoint.x, endPoint.y);
        line.graphics.endStroke();
        //console.log('draw line', startPoint, endPoint);
    });
    stage.update();

    // draw the rooms
    for (var i = 0; i < 25; i++) {
        var container = new createjs.Container();
        container.x = (mazeMap[i].column * CELL_WIDTH) + (CELL_WIDTH/2);
        container.y = (mazeMap[i].row * CELL_HEIGHT) + (CELL_HEIGHT/2);

        rooms[i] = new createjs.Shape();

        rooms[i].graphics.beginFill("DeepSkyBlue").drawCircle(0, 0, CELL_WIDTH/2*.9);
        //stage.addChild(rooms[i]);
        container.addChild(rooms[i]);

        // text
        var text = new createjs.Text();
        text.set({
            text: 'room\n' + (parseInt(i) + 1),
            font: 'bold 18px Arial',
            textAlign: 'center'
        });
        var b = text.getBounds();
        //text.x = parseInt(b.width/2);
        text.x = 0;
        text.y = -parseInt(b.height/2);
        container.addChild(text);
        //rooms[i].addChild(text);
        stage.addChild(container);
    }
    stage.update();

}

function loadSounds() {
    createjs.Sound.registerSound('sounds/game-started.mp3', 'game-started');
    createjs.Sound.registerSound('sounds/join-game.mp3', 'join-game');
    createjs.Sound.registerSound('sounds/join-room.mp3', 'join-room');
    createjs.Sound.registerSound('sounds/catch-attempt.mp3', 'catch-attempt');
    createjs.Sound.registerSound('sounds/hider-caught.mp3', 'hider-caught');
    createjs.Sound.registerSound('sounds/invalid-room-move.mp3', 'invalid-room-move');
    createjs.Sound.registerSound('sounds/leave-room.mp3', 'leave-room');
    createjs.Sound.registerSound('sounds/leave-game.mp3', 'leave-game');
    createjs.Sound.registerSound('sounds/game-ended.mp3', 'game-ended');
}

function updatePlayerList() {
    $('#players').empty();
    Object.keys(players).forEach(function(player) {
        $('#players').append(players[player].id + '<br>');
    });
}

function updatePlayers() {
    stage.update();
}

function updateBoard() {
    updatePlayers();
    updatePlayerList();
}

function roomToX(room) {
    return (mazeMap[room - 1].column * CELL_WIDTH) + parseInt((CELL_WIDTH / 2));
}

function roomToY(room) {
    return (mazeMap[room - 1].row * CELL_HEIGHT) + parseInt((CELL_HEIGHT / 2));
}

init();
