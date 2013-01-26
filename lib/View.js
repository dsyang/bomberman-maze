function View(canvas, props) {
    this.canvas = canvas
    this.context = canvas.getContext("2d");
    this.props = {
        viewX: 0,
        viewY: 0,
        viewWidth: canvas.width,
        viewHeight: canvas.height
    };
    copyProperties(this.props, props);
    var that = this;

    this.draw = function(map) {
        var viewX = 0;
        var viewY = 0;
        var portalX = inBlocks(that.props.viewWidth);
        var portalY = inBlocks(that.props.viewHeight);
        var mapEndX = inBlocks(game_configs["mapWidth"]);
        var mapEndY = inBlocks(game_configs["mapHeight"]);
        if(mapEndX - that.props.viewX < portalX) {
            that.props.viewX = mapEndX - portalX;
        }
        if(mapEndY - that.props.viewY < portalY) {
            that.props.viewY = mapEndY - portalY;
        }

        for(var i = that.props.viewX, viewX = 0;
            i < portalX+that.props.viewX; i++, viewX++) {
            for(var j = that.props.viewY, viewY = 0;
                j < portalY+that.props.viewY; j++, viewY++) {
                map.blocks[i][j].draw(inPixels(viewX), inPixels(viewY), that.context);
            }
        }

    };

};
