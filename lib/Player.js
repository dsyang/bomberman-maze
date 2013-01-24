function Player(canvas, context) {
    this.canvas = canvas;
    this.context = context;

    this.update = function () {
        //do nothing
    }

    //blocks
    this.draw = function (x,y) {
        this.context.fillRect(x+10,y+10,10,10);
    };
};
