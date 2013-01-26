function Tile(props) {
    this.props = {
        size: 40,
        img: [null,0,0],
        type: "base"
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
            context.fillText('('+inBlocks(x)+','+inBlocks(y)+')', x+10, y+10);
            context.restore();
        }
    };
};



//each cell is 40x40
function Map(canvas, context, props) {
    this.canvas = canvas;
    this.context = context;

    this.mkBlock = {
        grass: function(that) {
            return new Tile(that.tileData['grass']);
        },
        block: function(that) {
            return new Tile(that.tileData['block']);
        },
        wall: function(that) {
            return new Tile(that.tileData['wall']);
        }
    };
    this.props = {
        width: 2 * canvas.width,
        height: 2 * canvas.height,
        tileSize: 40,
        portalWidth: canvas.width,
        portalHeight: canvas.height,
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
                    block = this.mkBlock['wall'](this);
                  }  else {
                      if ((x/this.props.tileSize) % 2 === 1 ||
                          (y/this.props.tileSize) % 2 === 1 ) {
                              block = this.mkBlock['grass'](this);
                    } else {
                        block = this.mkBlock['wall'](this);
                    }
                  }
                row.push(block);
            }
            this.blocks.push(row);
        }

        //populate with blocks
        var that = this;
        this.blocks.forEach( function (row) {
            row.forEach( function (elem) {
                console.log(that.props.blockGen);
                if(elem.props.type === "grass" && Math.random() < that.props.blockGen) {
                    elem.above.push( that.mkBlock['block'](that));
                }
            });
        });
        // carve out blocks of p1 starting positions
        this.blocks[1][1].above = [];
        this.blocks[2][1].above = [];
        this.blocks[1][2].above = [];
        this.blocks[1][3].above = [ this.mkBlock['block'](this) ];
        this.blocks[3][1].above = [ this.mkBlock['block'](this) ];
        // carve out p2 position
        this.blocks[13][1].above = [];
        this.blocks[14][1].above = [];
        this.blocks[13][2].above = [];
        this.blocks[13][3].above = [ this.mkBlock['block'](this) ];
        this.blocks[15][1].above = [ this.mkBlock['block'](this) ];



    };

    this.update = function() {
        // do nothing
    }

    this.draw = function(x,y) {
        var viewX = 0;
        var viewY = 0;
        var portalX = inBlocks(this.props.portalWidth);
        var portalY = inBlocks(this.props.portalHeight);
        for(var i = x, viewX = 0; i < portalX+x; i++, viewX++) {
            for(var j = y, viewY = 0; j < portalY+y; j++, viewY++) {
                this.blocks[i][j].draw(inPixels(viewX), inPixels(viewY), this.context);
            }
        }
        return 0;
    };
};
