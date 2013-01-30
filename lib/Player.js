//Player 1 = red by default
//Player 2 = blue by default
// pos, color, images, lives
// dictionary of objects.
function Player(player, tiles) {
    var that = this;
    if (player === "p1" || (player === undefined)) {
        //by default atleast a single player (start position)
        this.pos = game_configs["p1Start"];
        this.color = game_configs["p1Color"];
        this.images = p1_images;
        this.player = "p1";
        this.spriteData = [
            [tiles, 160, 5],
            [tiles, 200, 5],
            [tiles, 240, 5],
            [tiles, 280, 5]
        ];
    }
    else {
        this.player = "p2";
        this.pos = game_configs["p2Start"];
        this.color = game_configs["p2Color"];
        this.images = p2_images;
        this.spriteData = [
            [tiles, 160, 46],
            [tiles, 200, 45],
            [tiles, 240, 45],
            [tiles, 280, 45]
        ];
    }


    this.lives = 6;
    this.objects = {
        bombCount: 0,
        coinCount: 0,
        keyCount: 0,
        hasExitKey: false,
        blocks: 0,
    };



    //controller. add bomb to above and return bomb
    this.placeBomb = function(i,j,map) {
        var bomb = new Item({type: "bomb", posI: i, posJ: j,
                    player: this.player, imgsrc: this.images["bomb"]});
        //push bomb on top of grass
        map.blocks[i][j].above.push(bomb);
        return bomb;
    };

    this.fireaway = function (dir,posX,posY,map) {
            // (i,j) is the position of bomb
            // (pos.i,pos.j) is the position of fire
            var board = map.blocks;
            var axis = dir[2];
            var pos = {i: posX+dir[0], j: posY+dir[1]};

            console.log("postition ("+pos.i+","+pos.j+")");
        //    console.log(typeof(board));

            var currTile = board[pos.i][pos.j];
            var fireImg;
            if (axis === "X")
                var fireImg = that.images["fireX"];
            else
                var fireImg = that.images["fireY"];
            var stepCount = game_configs["firePower"];
            while (currTile.props.type != "wall" && stepCount > 0){
                stepCount -= 1;
                var posPlayer1 = map.player1.pos;
                var posPlayer2 = {i:-1, j:-1};
                if (map.props.numPlayer === 2)
                    var posPlayer2 = map.player2.pos
                if ((pos.i === posPlayer1.i && pos.j === posPlayer1.j)) {
                    map.player1.lives -= 1;
                }
                if (pos.i === posPlayer2.i && pos.j === posPlayer2.j) {
                    map.player2.lives -= 1;
                }
               // console.log("postition ("+pos.i+","+pos.j+")");
                var fire = new Item({type: "fire", imgsrc: fireImg});
                //if objects on top of grass, destroy block (remove from the list)
                var result = getLast(currTile.above);
                if (result.success === true
                    && (result.value.props.type === "block" ||
                        result.value.props.type === "fire")
                       ) {
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
    this.explodeBomb = function(bomb,map) {
        var posPlayer1 = map.player1.pos;
        var posPlayer2 = {i:-1, j:-1};
        if (map.props.numPlayer === 2)
            var posPlayer2 = map.player2.pos
        var i = bomb.props.posI;
        var j = bomb.props.posJ;
        if ((i === posPlayer1.i && j === posPlayer1.j)) {
            map.player1.lives -= 1;
        }
        if (i === posPlayer2.i && j === posPlayer2.j) {
            map.player2.lives -= 1;
        }
        var board = map.blocks;
        var directions = {"left": [-1,0,"X"], "right":[+1,0,"X"],
                          "down": [0,+1,"Y"], "up": [0,-1,"Y"]};
        var paths = Object.keys(directions);
        var fire = new Item({type: "fire", imgsrc: that.images["fireX"]});
        map.blocks[i][j].above.push(fire);
        paths.forEach(function(path) {
            that.fireaway(directions[path],i,j,map);
        });
    };


    //draw the Player
    this.draw = function (context, viewport) {
       // console.log(this.pos);
        var x = inPixels(this.pos.i - viewport.viewLeft);
        var y = inPixels(this.pos.j - viewport.viewTop);
        size = game_configs["tileSize"];
        img = this.spriteData[this.pos.dir];
        context.save();
        context.fillStyle = this.color;
        context.drawImage(img[0],img[1], img[2],
                          size, size,x,y,
                          size, size);
        for(var i =0; i < this.lives; i+=2) {
            context.fillStyle = this.color;
            context.beginPath();
            context.arc(x+3, y+3+((i/2)*10), 3, 0, 2*Math.PI, true);
            context.fill();
        }
        context.restore();
    };
};
