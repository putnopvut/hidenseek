var GameBoard = (function () {
    var obj = {};
    var canvasEl;
    var width;
    var height;
    var sprites = [];
    var canvas;
    var context;
    var cellWidth;
    var cellHeight;
    var colors = [];

    var josh = {};
    var mark = {};

    obj.width;
    obj.height;

    function updateCanvasDimensions() {
        console.log('updateCanvasDimensions()');
        canvas.attr({height: $(window).height(), width: $(window).width()});
        obj.width = canvas.width();
        obj.height = canvas.height();
        obj.refresh();
    };

    function initEventListeners() {
        $(window).bind('resize', updateCanvasDimensions);
    };
    
    var init = function (config) {
        console.log(config);

        canvas = $(config.canvas);

        canvasEl = canvas[0]; // save DOM element
        obj.width = canvasEl.width;
        obj.height = canvasEl.height;

        console.log('initializing cavas with', obj.width, obj.height);
        context = canvasEl.getContext('2d');
        
        // setup random colors
        for (var i=0; i < 7; i++) {
            for (var j=0; j< 5; j++) {
                colors[i] = colors[i] || [];
                colors[i][j] = randomColor({luminosity: 'light'});
            }
        }

        initEventListeners();
        updateCanvasDimensions();

        setInterval(function () {
            josh.column = Math.floor(Math.random() * 7);
            josh.row = Math.floor(Math.random() * 5);
            mark.column = Math.floor(Math.random() * 7);
            mark.row = Math.floor(Math.random() * 5);
            console.log(josh, mark);
            obj.refresh();
        }, 5000);
    };

    var drawMaze = function () {
        var margin = 0;
        var top = margin;
        var left = margin;
        var bottom = obj.height - margin;
        var right = obj.width - margin;

        context.strokeRect(left, top, right - margin, bottom - margin);

        // draw our cells
        cellHeight = parseInt((bottom - top) / 5) + 1;
        cellWidth = parseInt((right - left) / 7) + 1;
        console.log(cellHeight, cellWidth);

        // horizontal
        //for (var i=1; i < 5; i++) {
        //    var line = new Path2D();
        //    line.moveTo(left, i * cellHeight);
        //    line.lineTo(right, i * cellHeight);
        //    context.stroke(line);
        //}

        // verticle 
        //for (var i=1; i < 7; i++) {
        //    var line = new Path2D();
        //    line.moveTo(i * cellWidth, top);
        //    line.lineTo(i * cellWidth, bottom);
        //    context.stroke(line);
        //}

        drawBlock(3, 0);
        drawBlock(4, 0);
        drawBlock(5, 0);
        drawBlock(6, 0);

        drawBlock(0, 1);
        //drawBlock(1, 1);
        //drawBlock(2, 1);
        //drawBlock(3, 1);
        //drawBlock(4, 1);
        drawBlock(5, 1);
        //drawBlock(6, 1);

        //drawBlock(0, 2);
        //drawBlock(1, 2);
        drawBlock(2, 2);
        //drawBlock(3, 2);
        //drawBlock(4, 2);
        //drawBlock(5, 2);
        //drawBlock(6, 2);

        //drawBlock(0, 3);
        //drawBlock(1, 3);
        //drawBlock(2, 3);
        //drawBlock(3, 3);
        //drawBlock(4, 3);
        //drawBlock(5, 3);
        //drawBlock(6, 3);

        drawBlock(0, 4);
        //drawBlock(1, 4);
        drawBlock(2, 4);
        //drawBlock(3, 4);
        //drawBlock(4, 4);
        drawBlock(5, 4);
        //drawBlock(6, 4);

        drawRoom(0, 0, '1', false, false, true, false);
        drawRoom(1, 0, '2', true, false, true, true);
        drawRoom(2, 0, '3', true, false, false, true);

        drawRoom(1, 1, '4', false, true, true, true);
        drawRoom(2, 1, '5', true, true, true, false);
        drawRoom(3, 1, '6', true, false, true, true);
        drawRoom(4, 1, '7', true, false, false, true);
        drawRoom(6, 1, '14', false, false, false, true);

        drawRoom(0, 2, '8', false, false, true, true);
        drawRoom(1, 2, '9', true, true, false, false);
        drawRoom(3, 2, '10', false, true, true, true);
        drawRoom(4, 2, '11', true, true, true, true);
        drawRoom(5, 2, '12', true, false, true, false);
        drawRoom(6, 2, '13', true, true, false, true);

        drawRoom(0, 3, '15', false, true, true, false);
        drawRoom(1, 3, '16', true, false, true, true);
        drawRoom(2, 3, '17', true, false, true, false);
        drawRoom(3, 3, '18', true, true, true, true);
        drawRoom(4, 3, '19', true, true, false, false);
        drawRoom(5, 3, '20', false, false, true, false);
        drawRoom(6, 3, '21', true, true, false, true);

        drawRoom(1, 4, '22', false, true, false, false);
        drawRoom(3, 4, '23', false, true, true, false);
        drawRoom(4, 4, '24', true, false, false, false);
        drawRoom(6, 4, '25', false, true, false, false);

    };

    var drawBlock = function (column, row) {
        //context.fillRect(column * cellWidth, row * cellHeight, cellWidth, cellHeight);
    };

    var drawJosh = function () {
        if (!josh) {
            return;
        }
        var img = document.getElementById("gravatarJosh");
        context.drawImage(img, (josh.column * cellWidth) + (cellWidth / 2), (josh.row * cellHeight) + (cellHeight / 2));
    };

    var drawMark = function () {
        if (!mark) {
            return;
        }
        var img = document.getElementById("gravatarMark");
        context.drawImage(img, (mark.column * cellWidth) + (cellWidth / 2), (mark.row * cellHeight) + (cellHeight / 2));
    };

    var drawRoom = function (column, row, name,
            canMoveLeft, canMoveUp, canMoveRight, canMoveDown) {
        var color = colors[column][row];
        var x = (column * cellWidth) + (cellWidth / 2);
        var y = (row * cellHeight) + (cellHeight / 2);
        var radius = Math.min(cellHeight, cellWidth) / 2 * .8;

        // draw connectors
        if (canMoveLeft === true) {
            var line = new Path2D();
            line.moveTo(x, y);
            line.lineTo(x - cellWidth/2, y);
            context.stroke(line);
        }
        if (canMoveRight === true) {
            var line = new Path2D();
            line.moveTo(x, y);
            line.lineTo(x + cellWidth/2, y);
            context.stroke(line);
        }
        if (canMoveUp === true) {
            var line = new Path2D();
            line.moveTo(x, y);
            line.lineTo(x, y - cellHeight/2);
            context.stroke(line);
        }
        if (canMoveDown === true) {
            var line = new Path2D();
            line.moveTo(x, y);
            line.lineTo(x, y + cellHeight/2);
            context.stroke(line);
        }

        context.beginPath();
        context.arc(x, y, radius, 0, 2 * Math.PI, false);
        context.fillStyle = color;
        context.fill();
        context.lineWidth = 2;
        context.strokeStyle = '#003300';
        context.stroke();
        
        context.fillStyle = '#003300';
        context.font = 'bold 20pt Calibri';
        context.fillText(name, x - 10, y + 10);

    };
    
    var clear = function() {
        context.clearRect(0, 0, obj.width, obj.height);
    };
    
    obj.refresh = function() {
        clear();
        drawMaze();
        sprites.forEach(function (sprite) {
            drawSprite(sprite.x, sprite.y, sprite.name, sprite.color);
        });

        drawJosh();
        drawMark();
    };
    
    obj.addSprite = function (x, y, name, color) {
        sprites.push({
            name: name,
            x: x,
            y: y,
            color: color
        });
        obj.refresh();
        return sprites.length - 1;
    };
    
    obj.updateSprite = function (num, x, y) {
        if ((sprites[num].x+x > 0) && (sprites[num].x+x < obj.width) ) {
            sprites[num].x = sprites[num].x + x;
        }
        if ((sprites[num].y+y > 0) && (sprites[num].y+y < obj.height) ) {
            sprites[num].y = sprites[num].y + y;
        }
        obj.refresh();
    };

    obj.getSpritePosition = function (num) {
        return {
            x: sprites[num].x,
            y: sprites[num].y,
        };
    };

    obj.setSpritePosition = function (num, x, y) {
        sprites[num].x = x;
        sprites[num].y = y;
    };
    
    var drawSprite = function (x, y, name, spriteColor) {
        var width = 100;
        var height = 75;
        var radius = 15;
        var color = spriteColor || 'green';

        context.beginPath();
        context.arc(x, y, radius, 0, 2 * Math.PI, false);
        context.fillStyle = spriteColor;
        context.fill();
        context.lineWidth = 2;
        context.strokeStyle = '#003300';
        context.stroke();
        
        context.fillStyle = '#003300';
        context.font = 'bold 10pt Calibri';
        context.fillText(name, x + 20, y + 4);
    };
    
    return function (config) {
        init(config);
        return obj;
    };
})();