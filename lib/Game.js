function Game(numPlayer, tileImg, options) {
    this.numPlayer = numPlayer;
    this.options = {};
    this.tiles = tileImg;
    this.objects = [];
    copyProperties(this.options, options);
    this.map = new Map({tiles: this.tiles});

    this.keysDown = {};

    var that = this;
    this.initialize = function (view1, view2) {
        that.map.initialize();
        that.map.player1 = new Player(game_configs["p1start"]);
        if(that.numPlayer === 2) {
            that.map.player2 = new Player(game_configs["p2start"]);
        }
        that.view1 = view1;
        that.view2 = view2;
        that.view1.draw(that.map);
        that.view2.draw(that.map);
    };

    this.start = function(fps) {
        intervalID = setInterval(this.gameLoop, (1000/fps));
    };

    this.gameLoop = function() {
        if(that.map.update()) {
            that.view1.draw(that.map);
            that.view2.draw(that.map);
        }

    }
};
