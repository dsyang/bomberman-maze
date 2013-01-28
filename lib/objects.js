function Item(props) {
	this.props = {
		size: game_configs["tileSize"],
		imgsrc: null,
		type: "base",
	};
	copyProperties(this.props,props);
	this.itemImage = new Image();
	this.itemImage.src = this.props.imgsrc
	//x and y pixels
	this.draw = function(x,y,context) {
		context.drawImage(this.itemImage,x,y,40,40);
	}
}




