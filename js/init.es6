// This inits the game

// Read in the map
function readMapFile(file)
{
	$.get(file, function(data){
		var wholeData = data;
		// A map file will have a width, a height and the matrix (map) separated by commas
		var array = wholeData.split(",");
		// Save width and height
		window.levelWidth = array[0];
		window.levelHeight = array[1];
		// Split by line breaks
		var map = array[2].split("\n");
		// Remove the frikkin first and last empty "arrays"
		map.splice(0,1);
		map.splice(window.levelHeight,1);
		// Split by spaces
		$.each(map, function(i, val){
			map[i] = map[i].split(" ");
		});
		// Save to global
		window.gamemap = map;
	});
}
	
// Read in the heightmap
function readHeightmapFile(file)
{
	$.get(file, function(data){
		var map = data.split("\n");
		$.each(map, function(i, val){
			map[i] = map[i].split(" ");
		});
		$.each(map, function(i, val){
			$.each(val, function(j, value){
				map[i][j] = parseInt(value);
			});
		});
		window.heightmap = map;
	});
}

	
// This function init's the game assets
function init(){
	readMapFile( "./Content/gamefile.txt" );
	readHeightmapFile( "./Content/heightmap.txt" );
	let cam = new Camera(64, 64, 15);
	window.cam = cam;
	let ghost = new Ghost(64, 64, 2, 2, 6, 4, 100);
	window.ghost = ghost;
}
