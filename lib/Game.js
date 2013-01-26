function Game(numPlayer, canvas, tileImg, options) {
    this.numPlayer = numPlayer;
    this.options = {};
    this.canvas = canvas;
    this.tiles = tileImg;
    copyProperties(this.options, options);
    var context = canvas.getContext("2d");
    this.map = new Map(canvas, context, {tiles: this.tiles});

    this.keysDown = {};

    var that = this;
    this.initialize = function () {
        that.map.initialize();
        that.player1 = new Player(canvas, context);
        if(that.numPlayer === 2) {
            that.player2 = new Player(canvas, context);
        }
        that.canvas.addEventListener(
            'keydown',
            function (event) {
                that.keysDown[event.keyCode] = true;
            },
            false);
        that.canvas.addEventListener(
            'keyup',
            function (event) {
                that.keysDown[event.keyCode] = false;
            },
            false);

    };

    this.start = function(fps) {
        intervalID = setInterval(this.gameLoop, (1000/fps));
    };

    this.gameLoop = function() {
        var p1delta = that.player1.update(that.keysDown);
        if(that.numPlayer === 2) {
            var p2delta = that.player2.update(that.keysDown);
        }
        that.map.update(that.keysDown);


//        that.map.draw(0,0);
//        that.player1.draw(p1delta);
    }
};
