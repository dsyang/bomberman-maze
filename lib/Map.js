// Two dictionaries
// .props (basic)
//

function Tile(props, i, j) {
    this.props = {
        size: game_configs["tileSize"],
        //img source, clipping coordinates (x,y)
        img: [null,0,0],
        type: "base",
        i : i,
        j : j,
    };
    copyProperties(this.props, props);
    this.above = [];
    this.draw = function(x,y,context) {
        context.save();
        context.drawImage(this.props.img[0],this.props.img[1], this.props.img[2],
                          this.props.size, this.props.size,x,y,
                          this.props.size, this.props.size);
        context.fillStyle = "white";
        context.fillText('('+i+','+j+')', x+10, y+10);
        context.restore();
        //draw the top-most element
        if(this.above.length !== 0) {
            this.above[this.above.length-1].draw(x,y,context);
        }
    };
};

function Coin(imgs, i, j) {
    this.props = {
        size: 30,
        //img source, clipping coordinates (x,y)
        imgs: imgs,
        type: "coin",
        i : i,
        j : j,
    };
    this.drawCount = 0;
    this.draw = function(x,y,context) {
        var num = this.drawCount % 16;
        var img = this.props.imgs[num];
        context.save();
        context.drawImage(img[0],img[1], img[2],
                          this.props.size, this.props.size,x+5,y+5,
                          this.props.size, this.props.size);
        context.restore();
    };
};



//each cell is 40x40
//entire Map Model independent of canvas or context
// CONTROLLER/MODEL
function Map(numPlayer,props) {
    // make the players
    this.player1 = new Player("p1", props.tiles);
    if(numPlayer === 2) {
            this.player2 = new Player("p2", props.tiles);
        }
    var that = this;
    this.mkBlock = {
        grass: function(that, i, j) {
            return new Tile(that.tileData['grass'], i, j);
        },
        block: function(that, i, j) {
            return new Tile(that.tileData['block'], i, j);
        },
        wall: function(that, i, j) {
            return new Tile(that.tileData['wall'], i, j);
        }
    };
    this.props = {
        width: game_configs["mapWidth"],
        height: game_configs["mapHeight"],
        tileSize: game_configs["tileSize"],
        //loading tiles image into map
        tiles: null,
        blockGen: game_configs["blockGen"],
    };
    copyProperties(this.props, props);
    //entire map
    this.blocks = [];
    //where are the coins
    this.coins = [];
    //individual tile images from the tile Image
    this.tileData = {grass: { img: [this.props.tiles, 42,42], type: "grass"},
                     block: { img: [this.props.tiles, 40, 0], type: "block"},
                     wall : { img: [this.props.tiles, 0, 42], type: "wall"}
                    };
    this.itemData = {key: { img: [this.props.tiles, 0, 0], type: "key" },
                     door: { img: [this.props.tiles, 85, 84], type: "door" },
                    };
    this.spawnCoin = function(i,j) {
        var imgs = [
            [this.props.tiles, 0, 200],
            [this.props.tiles, 0, 230],
            [this.props.tiles, 0, 260],
            [this.props.tiles, 0, 290],
            [this.props.tiles, 30, 200],
            [this.props.tiles, 30, 230],
            [this.props.tiles, 30, 260],
            [this.props.tiles, 30, 290],
            [this.props.tiles, 60, 200],
            [this.props.tiles, 60, 230],
            [this.props.tiles, 60, 260],
            [this.props.tiles, 60, 290],
            [this.props.tiles, 90, 200],
            [this.props.tiles, 90, 230],
            [this.props.tiles, 90, 260],
            [this.props.tiles, 90, 290]
        ];
        var coin = new Coin(imgs,i,j);
        console.log("making coin");
        this.coins.push({i:i, j:j});
        return coin;
    };

    this.initialize = function() {
        var block;
        var col = [];
        var toggle = 0;
        //generate map base
        //columnwise
        for(var x = 0; x < this.props.width; x += this.props.tileSize) {
            col = [];
            for(var y = 0; y < this.props.height; y += this.props.tileSize) {
                if( x === 0 || y === 0 ||
                    y >= this.props.height - this.props.tileSize ||
                    x >= this.props.width - this.props.tileSize
                  ) {
                    block = this.mkBlock['wall'](this, inBlocks(x), inBlocks(y));
                  }  else {
                      if ((x/this.props.tileSize) % 2 === 1 ||
                          (y/this.props.tileSize) % 2 === 1 ) {
                              block = this.mkBlock['grass'](this, inBlocks(x), inBlocks(y));
                    } else {
                        block = this.mkBlock['wall'](this, inBlocks(x), inBlocks(y));
                    }
                  }
                col.push(block);
            }
            this.blocks.push(col);
        }

        //populate with blocks and coins and key(s)
        this.blocks.forEach( function (col) {
            col.forEach( function (elem) {
                if(elem.props.type === "grass" && Math.random() < that.props.blockGen) {
                    if(Math.random() < game_configs["coinGen"]) {
                        var key =  that.spawnCoin(elem.props.i, elem.props.j);
                        elem.above.push( key );
                    }
                    elem.above.push( that.mkBlock['block'](that, elem.props.i, elem.props.j));
                }
            });
        });

        var doori = Math.floor(Math.random()*100) % ( inBlocks(game_configs["mapWidth"]) - 3) + 1
        var doorj = Math.floor(Math.random()*10) % ( inBlocks(game_configs["mapHeight"]) - 13) + 10
        if(this.blocks[doori][doorj].props.type === "wall") {
            this.blocks[doori][doorj-1] = new Tile(this.itemData["door"], doori, doorj-1);
            this.blocks[doori][doorj-1].above.push(this.mkBlock['block'](that, doori, doorj-1));
        } else {
            this.blocks[doori][doorj] = new Tile(this.itemData["door"], doori, doorj);
            this.blocks[doori][doorj].above.push(this.mkBlock['block'](that, doori, doorj));
        }
        // carve out blocks of p1 starting positions
        this.blocks[1][1].above = [];
        this.blocks[2][1].above = [];
        this.blocks[1][2].above = [];
        this.blocks[1][3].above = [ this.mkBlock['block'](this, 1, 3) ];
        this.blocks[3][1].above = [ this.mkBlock['block'](this, 3, 1) ];
        // carve out p2 position
        this.blocks[13][1].above = [];
        this.blocks[14][1].above = [];
        this.blocks[13][2].above = [];
        this.blocks[13][3].above = [ this.mkBlock['block'](this, 13, 3) ];
        this.blocks[15][1].above = [ this.mkBlock['block'](this, 15, 1) ];



    };


    var checkBounds = function(i, j, di, dj) {
        //console.log(that.blocks[i+di][j+dj]);
        var things = getLast(that.blocks[i+di][j+dj].above);
        if(that.blocks[i+di][j+dj].props.type === "wall" ||
           things.success === true && (things.value.props.type === "block" || things.value.props.type === "bomb")) {
            return {i: i, j: j};
        } else {
            return {i: i+di, j: j+dj};
        }

    }

    this.bombPos = { bx:[], by:[] };

    this.waterAllFire = function() {
        console.log("here");
        for(var index = 0; index < this.bombPos.bx.length; index++) {
            var i = this.bombPos.bx[index];
            var j = this.bombPos.by[index];
            this.removeFire(i,j)
        }
        this.bombPos.bx = [];
        this.bombPos.by = [];
    }

    //caused by single bomb
    //remove fire caused by bomb placed at index (posX,posY)
    this.removeFire = function(posX,posY){
        var board = this.blocks;
        var directions = {"left": [-1,0], "right":[+1,0],
                          "down": [0,+1], "up": [0,-1]};
        var paths = Object.keys(directions);
        paths.forEach(function(path) {removeFireBlock(directions[path])});

        function removeFireBlock(dir) {
            var pos = {i: posX, j: posY};
            var currTile = board[pos.i][pos.j];
            while (currTile.props.type != "wall"){
                console.log("inloop");
                console.log("water postition ("+pos.i+","+pos.j+")");
                var lastIndex = currTile.above.length-1;
                var burnt = lastIndex >= 0 && (currTile.above[lastIndex].props.type === "fire");
                var burntBomb = burnt && lastIndex >= 1 && (currTile.above[lastIndex-1].props.type === "bomb");
                if (burnt) {
                    //remove the fire item
                   console.log("before ");
                   console.log(board[pos.i][pos.j].above);
                   var water = board[pos.i][pos.j].above.pop();
                   console.log("after");
                   console.log(board[pos.i][pos.j].above);
                }
                if (burntBomb) {
                    console.log("burntBomb");
                    var waterBomb = board[pos.i][pos.j].above.pop(); //remove the bomb item
                }
                pos.i += dir[0];
                pos.j += dir[1];
                if (validIndex(pos.i,pos.j))
                    currTile = board[pos.i][pos.j];
                else
                    console.log("error: function removeFire: player.js: line 104");
            }
            //update map.blocks
            this.blocks = board;
        }

    }

    //**** kind of assumes that there are two players

    this.update = function(game) {
        var p1_Pos = {i: this.player1.pos.i, j: this.player1.pos.j},
            p2_Pos = {i: this.player2.pos.i, j: this.player2.pos.j};
        var p1_newPos = p1_Pos;
        var p2_newPos = p2_Pos;
        var bomb_down = false,
            use_item = false,
            waterFire = false,
            coins_visible = false;
        //there are exploded bombs on the board
        //fire to be removed
        if (this.bombPos.bx.length > 0) {
            waterFire = true;
            this.waterAllFire();
            window.setTimeout(function() {},10000);
        }

        for(var a = 0; a < game.map.coins.length; a++) {
            var p = game.map.coins[a];
            var aa = getLast(game.map.blocks[p.i][p.j].above);
            if (aa.success === true && aa.value.props.type === "coin") {
                coins_visible = true;
                break;
            }

        }

        function collectItem(playerPos,player) {
            var result = getLast(game.map.blocks[playerPos.i][playerPos.j].above);
            if( result["success"] && result.value.props.type === "coin") {
                game.map.blocks[playerPos.i][playerPos.j].above.pop();
                if(player === 1) game.map.player1.objects.coinCount++;
                if(player === 2) game.map.player1.objects.coinCount++;
            }
        };

        function coinsAnimate() {
            game.map.coins.forEach( function(obj) {
                var result = getLast(game.map.blocks[obj.i][obj.j].above);
                if (result["success"] && result.value.props.type === "coin") {
                    result.value.drawCount++;
                }
            });
        }

        var len = game.keyQueue.length;
        for(var i = 0; i < len; i++) {
            switch(game.keyQueue[i]) {
                case p1_controls.up:
                    p1_newPos = checkBounds(p1_Pos.i,p1_Pos.j, 0, -1);
                    p1_newPos.dir = 3;
                    collectItem(p1_newPos, 1);
                break;
                case p1_controls.left:
                    p1_newPos = checkBounds(p1_Pos.i,p1_Pos.j, -1, 0);
                    p1_newPos.dir = 1;
                    collectItem(p1_newPos, 1);
                break;
                case p1_controls.down:
                    p1_newPos = checkBounds(p1_Pos.i,p1_Pos.j, 0, 1);
                    p1_newPos.dir = 0;
                    collectItem(p1_newPos, 1);
                break;
                case p1_controls.right:
                    p1_newPos = checkBounds(p1_Pos.i,p1_Pos.j, 1, 0);
                    p1_newPos.dir = 2;
                    collectItem(p1_newPos, 1);
                break;
                case p1_controls.bomb:
                    bomb_down = true;
                    console.log("bomb by p1");
                    this.player1.placeBomb(p1_Pos.i,p1_Pos.j,this);
                    this.bombPos.bx.push(p1_Pos.i);
                    this.bombPos.by.push(p1_Pos.j);
                    var setOffBomb = window.setTimeout(function() {},2000);
                break;
                case p1_controls.use:
                    //pickup key or open door
                break;
                //player 2
                case p2_controls.up:
                    p2_newPos = checkBounds(p2_Pos.i, p2_Pos.j, 0, -1);
                    p2_newPos = 3;
                    collectItem(p2_newPos, 2);
                break;
                case p2_controls.left:
                    p2_newPos = checkBounds(p2_Pos.i, p2_Pos.j, -1, 0);
                    p2_newPos = 1;
                    collectItem(p2_newPos, 2);
                break;
                case p2_controls.down:
                    p2_newPos = checkBounds(p2_Pos.i, p2_Pos.j, 0, 1);
                    p2_newPos = 0;
                    collectItem(p2_newPos, 2);
                break;
                case p2_controls.right:
                    p2_newPos = checkBounds(p2_Pos.i, p2_Pos.j, 1, 0);
                    p2_newPos = 3;
                    collectItem(p2_newPos, 2);
                break;
                case p2_controls.bomb:
                    bomb_down = true;
                    console.log("bomb by p2");
                    this.player2.placeBomb(p2_Pos.i,p2_Pos.j,this);
                    this.bombPos.bx.push(p2_Pos.i);
                    this.bombPos.by.push(p2_Pos.j);
                    var setOffBomb = window.setTimeout(function() {},8000);

                    //make bomb
                break;
                case p2_controls.use:
                    //pickup key or open door
                break;
            }
        }
        game.keyQueue = game.keyQueue.slice(len);

        if(game.map.blocks[p1_newPos.i][p1_newPos.j].props.type === "door" && this.player1.objects.keyCount>0) {
            console.log("GAME OVER");
            game.over = "player1";
            return true;
        } else if(game.map.blocks[p2_newPos.i][p2_newPos.j].props.type === "door" && this.player2.objects.keyCount>0) {
            console.log("GAME OVER!!");
            game.over = "player2";
            return true;


}
        if(p1_newPos.i === p1_Pos.i && p1_newPos.j === p1_Pos.j &&
           p2_newPos.i === p2_Pos.i && p2_newPos.j === p2_Pos.j &&
           bomb_down === false && use_item === false &&
           waterFire === false && coins_visible === false) {
            console.log('no update');
            return false;
        } else {
            copyProperties(this.player1.pos, p1_newPos);
            copyProperties(this.player2.pos, p2_newPos);
            coinsAnimate();
            console.log("update!, p1: "+ this.player1.pos.i + ',' + this.player1.pos.j +
                        " p2: "+ this.player2.pos.i + "," + this.player2.pos.j);
            return true;
        }
    };

};
