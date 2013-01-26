function Tile(props, i, j) {
    this.props = {
        size: 40,
        img: [null,0,0],
        type: "base",
        i : i,
        j : j,
    };
    copyProperties(this.props, props);
    this.above = [];
    this.draw = function(x,y,context) {
        if(this.above.length !== 0) {
            this.above[this.above.length-1].draw(x,y,context);
        } else {
            context.save();
            context.drawImage(this.props.img[0],this.props.img[1], this.props.img[2],
                              this.props.size, this.props.size,x,y,
                              this.props.size, this.props.size);
            context.fillStyle = "white";
            context.fillText('('+i+','+j+')', x+10, y+10);
            context.restore();
        }
    };
};



//each cell is 40x40
function Map(props) {
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
        width: 840,
        height: 800,
        tileSize: 40,
        tiles: null,
        blockGen: 0.8
    };
    copyProperties(this.props, props);
    this.blocks = [];

    this.tileData = {grass: { img: [this.props.tiles, 42,42], type: "grass"},
                     block: { img: [this.props.tiles, 40, 0], type: "block"},
                     wall : { img: [this.props.tiles, 0, 42], type: "wall"}
                    };




    this.initialize = function() {
        var block;
        var row = [];
        var toggle = 0;
        //generate map base
        for(var x = 0; x < this.props.width; x += this.props.tileSize) {
            row = [];
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
                row.push(block);
            }
            this.blocks.push(row);
        }

        //populate with blocks
        this.blocks.forEach( function (row) {
            row.forEach( function (elem) {
                console.log(that.props.blockGen);
                if(elem.props.type === "grass" && Math.random() < that.props.blockGen) {
                    elem.above.push( that.mkBlock['block'](that, elem.props.i, elem.props.j));
                }
            });
        });
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


    var checkBounds = function(x, y, dx, dy) {
        console.log(that.blocks[x+dx][y+dy]);
        if(that.blocks[x+dx][y+dy].props.type === "wall" ||
           that.blocks[x+dx][y+dy].above.length !== 0) {
            return {x: x, y: y};
        } else {
            return {x: x+dx, y: y+dy};
        }

    }


    this.update = function(game) {
        var p1_newPos = {x: this.player1.pos.x, y: this.player1.pos.y},
            p2_newPos = {x: this.player2.pos.x, y: this.player2.pos.y};
        var bomb_down = false,
            use_item = false;
        var len = game.keyQueue.length;
        for(var i = 0; i < len; i++) {
            switch(game.keyQueue[i]) {
                case p1_controls.up:
                    p1_newPos = checkBounds(this.player1.pos.x,
                                            this.player1.pos.y, 0, -1);
                break;
                case p1_controls.left:
                    p1_newPos = checkBounds(this.player1.pos.x,
                                            this.player1.pos.y, -1, 0);
                break;
                case p1_controls.down:
                    p1_newPos = checkBounds(this.player1.pos.x,
                                            this.player1.pos.y, 0, 1);
                break;
                case p1_controls.right:
                    p1_newPos = checkBounds(this.player1.pos.x,
                                            this.player1.pos.y, 1, 0);
                break;
                case p1_controls.bomb:
                    //make bomb
                break;
                case p1_controls.use:
                    //pickup key or open door
                break;
                //player 2
                case p2_controls.up:
                    p2_newPos = checkBounds(this.player2.pos.x,
                                            this.player2.pos.y, 0, -1);
                break;
                case p2_controls.left:
                    p2_newPos = checkBounds(this.player2.pos.x,
                                            this.player2.pos.y, -1, 0);
                break;
                case p2_controls.down:
                    p2_newPos = checkBounds(this.player2.pos.x,
                                            this.player2.pos.y, 0, 1);
                break;
                case p2_controls.right:
                    p2_newPos = checkBounds(this.player2.pos.x,
                                            this.player2.pos.y, 1, 0);
                break;
                case p2_controls.bomb:
                    //make bomb
                break;
                case p2_controls.use:
                    //pickup key or open door
                break;
            }
        }
        game.keyQueue = game.keyQueue.slice(len);
        if(p1_newPos.x === this.player1.pos.x && p1_newPos.y === this.player1.pos.y &&
           p2_newPos.x === this.player2.pos.x && p2_newPos.y === this.player2.pos.y &&
           bomb_down === false && use_item === false) {
            console.log('no update');
            return false;
        } else {
            copyProperties(this.player1.pos, p1_newPos);
            copyProperties(this.player2.pos, p2_newPos);
            console.log("update!, p1: "+ this.player1.pos.x + ',' + this.player1.pos.y +                            " p2: "+ this.player2.pos.x + "," + this.player2.pos.y);
            return true;
        }
    };

};
