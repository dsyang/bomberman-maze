function Game(numPlayer, canvas, tileImg, options) {
    this.numPlayer = numPlayer;
    this.options = {};
    this.canvas = canvas;
    this.tiles = tileImg;
    copyProperties(this.options, options);
    var context = canvas.getContext("2d");
    this.map = new Map(canvas, context, {tiles: this.tiles});
    var that = this;
    this.initialize = function () {
        that.map.initialize();
        that.player1 = new Player(canvas, context);
        if(that.numPlayer === 2) {
            //add extra player
        }
    };

    this.start = function(fps) {

        intervalID = setInterval(this.gameLoop, (1000/fps));
    };

    this.frameCount = 0;
    this.gameLoop = function() {
        that.map.update();
        that.player1.update();
        if(that.numPlayer === 2) {
            that.player2.update();
        }
        that.map.draw(0,0);
        that.player1.draw(1,1+that.frameCount*10);
        that.frameCount++;
    }
};
