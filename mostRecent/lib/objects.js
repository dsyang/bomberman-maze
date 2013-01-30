function Item(props) {
	this.props = {
		size: game_configs["tileSize"],
		imgsrc: null,
		type: "base",
		posI: 0,
		posJ: 0,
		timerCount: 3, //for bomb
		player: "p1",
	};
	copyProperties(this.props,props);
	this.itemImage = new Image();
	this.itemImage.src = this.props.imgsrc
	//x and y pixels
	this.draw = function(x,y,context) {
		context.drawImage(this.itemImage,x,y,40,40);
	}
}




