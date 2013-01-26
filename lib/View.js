function View(canvas, props) {
    this.canvas = canvas
    this.context = canvas.getContext("2d");
    this.props = {
        player: null,
        viewLeft: 0,
        viewTop: 0,
        viewWidth: inBlocks(canvas.width),
        viewHeight: inBlocks(canvas.height)
    };
    copyProperties(this.props, props);
    var that = this;

    this.draw = function(map) {
        var mapEndi = inBlocks(game_configs["mapWidth"]);
        var mapEndj = inBlocks(game_configs["mapHeight"]);
        if(mapEndi - this.props.viewLeft < this.props.viewWidth) {
            this.props.viewLeft = mapEndi - this.props.viewWidth;
        }
        if(mapEndj - this.props.viewTop < this.props.viewHeight) {
            this.props.viewTop = mapEndj - this.props.viewHeight;
        }
        console.log("from " + this.props.viewLeft + " to " + this.props.viewWidth);
        for(var i = this.props.viewLeft;
            i < this.props.viewWidth+this.props.viewLeft; i++) {
            for(var j = this.props.viewTop;
                j < this.props.viewHeight+this.props.viewTop; j++) {
                map.blocks[i][j].draw(inPixels(i-this.props.viewLeft), inPixels(j-this.props.viewTop), this.context);
            }
        }

        if(this.props.player === 1) {
            console.log(map.player1.pos);
            map.player1.draw(this.context, {viewLeft: this.props.viewLeft, viewTop: this.props.viewTop});
        } else if(this.props.player === 2) {
            console.log(map.player2.pos);
            map.player2.draw(this.context, {viewLeft: this.props.viewLeft, viewTop: this.props.viewTop});
        } else {
            map.player1.draw(this.context, {viewLeft: this.props.viewLeft, viewTop: this.props.viewTop});
            map.player2.draw(this.context, {viewLeft: this.props.viewLeft, viewTop: this.props.viewTop});
        }

    };

};
