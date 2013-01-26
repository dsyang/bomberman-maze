function copyProperties(defaults, props) {
		var key;
		for (key in props) {
				defaults[key] = props[key];
		}
}

var inBlocks = function(num) { return num / game_configs.tileSize;};
var inPixels = function(num) { return num * game_configs.tileSize;};
