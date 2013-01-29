function copyProperties(defaults, props) {
		var key;
		for (key in props) {
				defaults[key] = props[key];
		}
}
// number of blocks
var inBlocks = function(size) { return size / game_configs.tileSize;};
// (x,y) pixel position respectively: num = x or y.
var inPixels = function(num) { return num * game_configs.tileSize;};

var getLast = function(array) {
    var k;
    if(array.length === 0) {
        return {success: false};
    } else {
        k = array.pop();
        array.push(k);
        return {success: true, value: k};
    }
}

var centerPixels = function(i,j) {
	var centerX = inPixels(i)+game_configs["tileSize"];
	var centerY = inPixels(j)+game_configs["tileSize"];
	return (centerX,centerY);
}

var validIndex = function(i,j) {
	var blocksX = inBlocks(game_configs["mapWidth"]);
	var blocksY = inBlocks(game_configs["mapHeight"]);
	if (!(i >= 0 && j >=0 && i < blocksX && j < blocksY))
		return false;
	return true;
}
