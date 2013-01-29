//x, y ---> in pixels
//i, j ---> in blocks

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
        //entire map
        var mapEndi = inBlocks(game_configs["mapWidth"]);
        var mapEndj = inBlocks(game_configs["mapHeight"]);
        var playerPos;

        function getPlayerPos(view) {
            if(view.props.player === 1) { return map.player1.pos; }
            else if(view.props.player === 2) { return map.player2.pos; }
            else { return null; }
        }

        playerPos = getPlayerPos(this);
        if(playerPos) {
            centerI = Math.floor(this.props.viewHeight/2);
            centerJ = Math.floor(this.props.viewWidth/2);
            if(playerPos.i - centerI < 0) {
                this.props.viewLeft = 0;
            } else {
                this.props.viewLeft = playerPos.i - centerI;
            }
            if (mapEndi - this.props.viewLeft < this.props.viewWidth) {
                this.props.viewLeft = mapEndi - this.props.viewWidth;
            }
            //now for J
            if(playerPos.j - centerJ < 0) {
                this.props.viewTop = 0;
            } else {
                this.props.viewTop = playerPos.j - centerJ;
            }
            if (mapEndj - this.props.viewTop < this.props.viewHeight) {
                this.props.viewTop = mapEndj - this.props.viewHeight;
            }
            console.log(centerI, centerJ);
        }



        for(var i = this.props.viewLeft;
            i < this.props.viewWidth+this.props.viewLeft; i++) {
            for(var j = this.props.viewTop;
                j < this.props.viewHeight+this.props.viewTop; j++) {
                map.blocks[i][j].draw(inPixels(i-this.props.viewLeft),
                    inPixels(j-this.props.viewTop), this.context);
            }
        }

        //draw the players

        map.player1.draw(this.context, {viewLeft: this.props.viewLeft,
                                        viewTop: this.props.viewTop});
        map.player2.draw(this.context, {viewLeft: this.props.viewLeft,
                                        viewTop: this.props.viewTop});



    };

};
