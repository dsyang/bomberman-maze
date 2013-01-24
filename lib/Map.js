function GrassTile(props) {
		this.props = {
				width: 40,
				height: 40,
				x: 0,
				y: 0,
				img: [null,0,0],
		};
		copyProperties(this.props, props);

		this.draw = function(context) {
				context.save();
				context.drawImage(this.props.img[0],this.props.img[1], this.props.img[2],
													this.props.width, this.props.height,
													this.props.x,this.props.y, this.props.width, this.props.height);
				context.restore();
		};
};

function BlockTile(props) {
		this.props = {
				width: 40,
				height: 40,
				x: 0,
				y: 0,
				img: [null,0,0],
		};
		copyProperties(this.props, props);
		this.draw = function(context) {
				context.save();
				context.drawImage(this.props.img[0],this.props.img[1], this.props.img[2],
													this.props.width, this.props.height,
													this.props.x,this.props.y, this.props.width, this.props.height);
				context.restore();
		};
};

function WallTile(props) {
		this.props = {
				width: 40,
				height: 40,
				x: 0,
				y: 0,
				img: [null,0,0],
		};
		copyProperties(this.props, props);
		this.draw = function(context) {
				context.save();
				context.drawImage(this.props.img[0],this.props.img[1], this.props.img[2],
													this.props.width, this.props.height,
													this.props.x,this.props.y, this.props.width, this.props.height);
				context.restore();
		};
};


//each cell is 40x40
function Map(canvas, context, props) {
		this.canvas = canvas;
		this.context = context;
		this.block_types = {grass: GrassTile, block: BlockTile, wall: WallTile};
		this.props = {
				width: canvas.width+200,
				height: canvas.height+200,
				tileWidth: 40,
				tileHeight: 40,
				tileX: 0,
				tileY: 0,
				tiles: null
		};
		copyProperties(this.props, props);
		this.blocks = [];

		this.tileData = {'grass': [this.props.tiles, 42,42],
										 'block': [this.props.tiles, 40,0],
										 'wall' : [this.props.tiles, 0,42]};
		this.initialize = function() {
				var block;
				var toggle = 0;
				for(var x = 0; x < this.props.width; x+= this.props.tileWidth) {
						for(var y = 0; y < this.props.height; y += this.props.tileHeight) {
								if( x === 0 || y === 0 ||
										y >= this.props.height - this.props.tileHeight ||
										x >= this.props.width - this.props.tileWidth
									) {
										// this is the edge, draw wall
										block = new this.block_types['wall']({x:x, y:y,
																													width: this.props.tileWidth,
																													height: this.props.tileHeight,
																												  img: this.tileData['wall']});
									}  else {
											if ((x/this.props.tileWidth) % 2 === 1 ||
											  (y/this.props.tileHeight) % 2 === 1 ) {
												block = new this.block_types['grass']({x:x, y:y,
																															 width: this.props.tileWidth,
																															 height: this.props.tileHeight,
																															 img: this.tileData['grass']});
										} else {
												block = new this.block_types['wall']({x:x, y:y,
																															 width: this.props.tileWidth,
																															 height: this.props.tileHeight,
																															 img: this.tileData['wall']});
										}
								}
								this.blocks.push(block);
						}
				}
		};


		this.draw = function(x,y) {
				var that = this;
				this.blocks.forEach (function (x) { x.draw(that.context); });
		};
};
