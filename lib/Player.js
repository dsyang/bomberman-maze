//Player 1 = red by default
//Player 2 = blue by default
// pos, color, images, lives
// dictionary of objects.
function Player(player) {
    if (player === "p1" || (player === undefined)) {
        //by default atleast a single player (start position)
        this.pos = game_configs["p1Start"];
        this.color = game_configs["p1Color"];
        this.images = p1_images;
    }
    else {
        this.pos = game_configs["p2Start"];
        this.color = game_configs["p2Color"];
        this.images = p2_images;
    }

    this.lives = 3;
    this.objects = {
        bombCount: 0,
        keyCount: 0,
        hasExitKey: false,
        blocks: 0,
    };

    var that = this;

    //controller. add bomb to above.
    this.placeBomb = function(i,j,map) {
        var bomb = new Item({type: "bomb", imgsrc: this.images["bomb"]});
        //push bomb on top of grass
        map.blocks[i][j].above.push(bomb);
        this.explodeBomb(i,j,map);
    };

    this.fireaway = function (dir,posX,posY,map) {
            // (i,j) is the position of bomb
            // (pos.i,pos.j) is the position of fire
            var board = map.blocks;
            var axis = dir[2];
            var pos = {i: posX, j: posY};

         //   console.log("postition ("+pos.i+","+pos.j+")");
         //   console.log(typeof(board));
            var currTile = board[pos.i][pos.j];
            var fireImg;
            if (axis === "X")
                var fireImg = that.images["fireX"];
            else
                var fireImg = that.images["fireY"];
            console.log(dir);
            while (currTile.props.type != "wall"){
               // console.log("postition ("+pos.i+","+pos.j+")");
                var fire = new Item({type: "fire", imgsrc: fireImg});
                //if objects on top of grass, destroy block (remove from the list)
                if (currTile.above.length > 0) {
                    var destroy = board[pos.i][pos.j].above.pop();
                }
                //push fire into the list
                board[pos.i][pos.j].above.push(fire);
                pos.i += dir[0];
                pos.j += dir[1];
                if (validIndex(pos.i,pos.j))
                    currTile = board[pos.i][pos.j];
                else
                    console.log("error: function Fireaway: player.js: line 64");
            }
            //update map.blocks
            map.blocks = board;
        }

    //controller add fire
    this.explodeBomb = function(i,j,map) {
        var board = map.blocks;
        var directions = {"left": [-1,0,"X"], "right":[+1,0,"X"],
                          "down": [0,+1,"Y"], "up": [0,-1,"Y"]};
        var paths = Object.keys(directions);
        paths.forEach(function(path) {
            console.log(directions[path]);
            that.fireaway(directions[path],i,j,map);
        });
    };


    //draw the Player
    this.draw = function (context, viewport) {
       // console.log(this.pos);
        context.save();
        context.fillStyle = this.color;
        context.fillRect(inPixels(this.pos.i-viewport.viewLeft),inPixels(this.pos.j-viewport.viewTop),10,10);
        context.restore();
    };
};
