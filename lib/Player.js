function Player(position, color) {
    this.pos = { i: 0, j : 0 };
    copyProperties(this.pos, position);
    this.color = color;
    //blocks
    this.draw = function (context) {
        console.log(this.pos);
        context.save();
        context.fillStyle = this.color;
        context.fillRect(inPixels(this.pos.i),inPixels(this.pos.j),10,10);
        context.restore();
    };
};
