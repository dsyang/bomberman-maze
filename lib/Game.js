//create new map
// initalize: create views and draw the views of the map.
// start: setInterval that calls gameLoop
// gameLoop: if map is updated redraw the views

function Game(numPlayer, tileImg, options) {
    this.numPlayer = numPlayer;
    this.options = {};
    this.tiles = tileImg;
    this.objects = [];
    copyProperties(this.options, options);
    this.map = new Map(numPlayer,{tiles: this.tiles});

    this.keyQueue = [];

    var that = this;
    this.initialize = function (view1, view2) {
        that.map.initialize();
        //create the map model,
        //create the players
        
        that.view1 = view1;
        that.view2 = view2;
        //first draw
        that.view1.draw(that.map);
        that.view2.draw(that.map);
    };

    this.start = function(fps) {
        intervalID = setInterval(this.gameLoop, (1000/fps));
    };

    this.gameLoop = function() {
        //if map is updated, draw it
        if(that.map.update(that)) {
            that.view1.draw(that.map);
            that.view2.draw(that.map);
            viewDebug.draw(that.map);
        }

    }
};
