function Player(position) {
    this.pos = { x: 0, y : 0};
    copyProperties(this.pos, position);

    console.log(position);

    //blocks
    this.draw = function (delta) {
        var newPos = {x: this.pos.x + delta.dx, y: this.pos.y + delta.dy};
        this.context.fillRect(inPixels(newPos.x)+10,inPixels(newPos.y)+10,10,10);
        copyProperties(this.pos, newPos);
    };
};
