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
        if(mapEndi - that.props.viewLeft < that.props.viewWidth) {
            that.props.viewLeft = mapEndi - that.props.viewWidth;
        }
        if(mapEndj - that.props.viewTop < that.props.viewHeight) {
            that.props.viewTop = mapEndj - that.props.viewHeight;
        }
        console.log("from " + that.props.viewLeft + " to " + that.props.viewWidth);
        for(var i = that.props.viewLeft;
            i < that.props.viewWidth+that.props.viewLeft; i++) {
            for(var j = that.props.viewTop;
                j < that.props.viewHeight+that.props.viewTop; j++) {
                map.blocks[i][j].draw(inPixels(i-that.props.viewLeft), inPixels(j-that.props.viewTop), that.context);
            }
        }

        if(that.props.player === 1) {
            console.log(map.player1.pos);
            map.player1.draw(that.context);
        } else if(that.props.player === 2) {
            console.log(map.player2.pos);
            map.player2.draw(that.context);
        } else {
            map.player1.draw(that.context);
            map.player2.draw(that.context);
        }

    };

};
