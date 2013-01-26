function Player(canvas, context) {
    this.canvas = canvas;
    this.context = context;
    this.position = game_configs.p1Start;

    this.update = function (keysDown) {
        var dx = 0;
        var dy = 0;
        if(keysDown[p1_controls.up]) {
            dy = -1;
            return {dx: dx, dy: dy};
        } else if (keysDown[p1_controls.down]) {
            dy = 1;
            return {dx: dx, dy: dy};
        } else if (keysDown[p1_controls.left]) {
            dx = -1;
            return {dx: dx, dy: dy};
        } else if (keysDown[p1_controls.right]) {
            dx = 1;
            return {dx: dx, dy: dy};
        }


        return {dx: dx, dy: dy};
    }

    //blocks
    this.draw = function (delta) {
        var newPos = {x: this.position.x + delta.dx, y: this.position.y + delta.dy};
        this.context.fillRect(inPixels(newPos.x)+10,inPixels(newPos.y)+10,10,10);
        copyProperties(this.position, newPos);
    };
};
