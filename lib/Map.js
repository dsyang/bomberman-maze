function Tile(img, props) {
		this.props = {
				size: 40,
				img: [null,0,0],
		};
		copyProperties(this.props, props);
		this.props.img = img
		this.draw = function(x,y,context) {
				context.save();
				console.log("drawing...("+x+","+y+")");
				context.drawImage(this.props.img[0],this.props.img[1], this.props.img[2],
													this.props.size, this.props.size,x,y,
													this.props.size, this.props.size);
				context.restore();
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
				tiles: null
		};
		copyProperties(this.props, props);
		this.blocks = [];

		this.tileData = {grass: [this.props.tiles, 42,42],
										 block: [this.props.tiles, 40, 0],
										 wall : [this.props.tiles, 0, 42]};


		this.inBlocks = function(num) { return num / this.props.tileSize;};
		this.inPixels = function(num) { return num * this.props.tileSize;};

		this.initialize = function() {
				var block;
				var row = [];
				var toggle = 0;
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
		};

		this.draw = function(x,y) {
				var viewX = 0;
				var viewY = 0;
				var portalX = this.inBlocks(this.props.portalWidth);
				var portalY = this.inBlocks(this.props.portalHeight);
				for(var i = x, viewX = 0; i < portalX+x; i++, viewX++) {
						for(var j = y, viewY = 0; j < portalY+y; j++, viewY++) {
								this.blocks[i][j].draw(this.inPixels(viewX), this.inPixels(viewY), this.context);
						}
				}

		}

};
