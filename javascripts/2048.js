$(document).ready(function() {
  console.log('ready!');

  placeFirstTiles();

  $('body').keydown(function(event){
    var arrow_keys = [37, 38, 39, 40];

    if(arrow_keys.indexOf(event.which) > -1) { // meaning the key that was pressed is in the array
      var tile = $('.tile');                   // all of the tiles
      moveTile(tile, event.which);             // move all of the tiles in the arrow direction
      event.preventDefault();                  // prevent default arrow key browser movement
    }
  });
});

function placeFirstTiles() {
  var grid_options = ["r0,c0", "r0,c1", "r0,c2", "r0,c3", "r1,c0", "r1,c1", "r1,c2", "r1,c3", "r2,c0", "r2,c1", "r2,c2", "r2,c3", "r3,c0", "r3,c1", "r3,c2", "r3,c3"];

  // place 2 tiles to start game
  for (i = 0; i < 2; i++) {
    // pick random value
    var random_index = getRandomIntInclusive(0, grid_options.length - 1);
    var new_tile_position = grid_options[random_index]; // "r0,c0"
    var new_row = new_tile_position.split(",")[0]; // "r0"
    var new_col = new_tile_position.split(",")[1]; // "c0"
    // remove from array
    grid_options.remove(new_tile_position);
    // assign to div
    var new_tile = $("<div>");
    new_tile.addClass("tile");
    new_tile.attr({
          "data-row" : new_row,
          "data-col" : new_col,
          "data-val" : "2"
      });
    new_tile.html("2");
    // add tile to board
    $("#gameboard").append(new_tile);
  }
}

function moveTile(tile, direction) {
  switch(direction) {
    case 38: //up
      var tiles = $('.tile');

      for (i = 0; i < tiles.length; i ++) {
        var active_tile = tiles[i];

        var data_row_num = parseInt(active_tile.getAttribute('data-row')[1]);
        var data_col_num = parseInt(active_tile.getAttribute('data-col')[1]);

        for(j = data_row_num ; j >= 0; j--) {
          var next_row_num = j - 1;
          var next_tile = $('.tile[data-row="r' + next_row_num + '"][data-col="c' + data_col_num + '"]');

          if (next_tile.length === 0 && next_row_num >= 0 && next_row_num <= 3) { // so the next tile doesn't exist
            $(active_tile).attr('data-row', "r" + next_row_num); // move the tile to that position
          }
        }
      }
      break;

    case 40: //down

      // for each row
      for (i = 3; i >= 0; i--) {
        var tiles = $('.tile[data-row="r' + i + '"]');

        for (j = 0; j < tiles.length; j ++) {
          var active_tile = tiles[j];

          var data_row_num = parseInt(active_tile.getAttribute('data-row')[1]);
          var data_col_num = parseInt(active_tile.getAttribute('data-col')[1]);

          for(k = data_row_num ; k < 4; k++) {
            var next_row_num = k + 1;
            var next_tile = $('.tile[data-row="r' + next_row_num + '"][data-col="c' + data_col_num + '"]');

            if (next_tile.length === 0 && next_row_num >= 0 && next_row_num <= 3) { // so the next tile doesn't exist
              $(active_tile).attr('data-row', "r" + next_row_num); // move the tile to that position
            }
          }
        }
      }

      // tile.attr("data-row","r3");
      break;
    case 37: //left
      tile.attr("data-col","c0");
      break;
    case 39: //right
      tile.attr("data-col","c3");
      break;
  } // end switch

  // if board is full, see if tile combinations are possible
  // if not full, add another tile after move
  console.log($(".tile").length);
  if ( $(".tile").length > 15 ) {
    checkPossibleMoves();
  } else {
    addTile();
  }

} // end moveTile

// extend ability to remove values from arrays, because reasons
Array.prototype.remove = function(value) {
    if (this.indexOf(value)!== -1) {
       this.splice(this.indexOf(value), 1);
       return true;
   } else {
      return false;
   }
};

function addTile() {
  var present_tiles = (document.getElementsByClassName("tile")); // find all tiles
  var positions = [];
  for (var i = 0; i < present_tiles.length; i++) { // pull each tile position into string pair "r0,c0"
    var row = present_tiles[i].getAttribute("data-row");
    var col = present_tiles[i].getAttribute("data-col");
    var position_pair = row + "," + col;
    positions.push(position_pair); // push into array ["r0,c0", "r0,c1"]
  } // now have positions of all present tiles (changes after each move)

  var grid_options = ["r0,c0", "r0,c1", "r0,c2", "r0,c3", "r1,c0", "r1,c1", "r1,c2", "r1,c3", "r2,c0", "r2,c1", "r2,c2", "r2,c3", "r3,c0", "r3,c1", "r3,c2", "r3,c3"];

  // iterate through list of all possible positions, remove those currently on board
  for (var j = 0; j < positions.length; j++) {
    grid_options.remove(positions[j]);
  }

  // randomly pick a position to place a tile from remaining array
  var random_index = getRandomIntInclusive(0, grid_options.length - 1);
  var new_tile_position = grid_options[random_index]; // "r0,c0"
  var new_row = new_tile_position.split(",")[0]; // "r0"
  var new_col = new_tile_position.split(",")[1]; // "c0"

  // plug those values into a newly created div's attributes
  var new_tile = $("<div>");
  new_tile.addClass("tile");
  new_tile.attr({
        "data-row" : new_row,
        "data-col" : new_col,
        "data-val" : "2"
    });
  new_tile.html("2");
  // add tile to board
  $("#gameboard").append(new_tile);
} // end addTile

// for picking random cell to place a new tile
// pulled from the internet (why must it be so damn gross?)
// "Returns a random integer between min (included) and max (included)"
function getRandomIntInclusive(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function checkPossibleMoves() {
  var present_tiles = $(".tile"); // find all tiles
  // iterate through all tiles
  for (i = 0; i < present_tiles.length; i++) {
    var tile = present_tiles[i];
    var row = tile.getAttribute("data-row"); // "r1"
    var col = tile.getAttribute("data-col"); // "c2"
    var val = tile.getAttribute("data-val"); // "2"

    var row_num = parseInt(row.slice(-1)); // 2
    var col_num = parseInt(col.slice(-1)); // 1

    // do math on that tile's value to obtain all valid positions adjacent to it
    var tile_above = $('.tile[data-row="r' + (row_num - 1) + '"][data-col="c' + col_num + '"]');
    var tile_below = $('.tile[data-row="r' + (row_num + 1) + '"][data-col="c' + col_num + '"]');
    var tile_right = $('.tile[data-row="r' + row_num + '"][data-col="c' + (col_num + 1) + '"]');
    var tile_left = $('.tile[data-row="r' + row_num + '"][data-col="c' + (col_num - 1) + '"]');

    // check data values of all tiles in those positions
    // if adjascent tile's values match current tile, a move is still possible
    // so break out of loop
    // if selector is invalid (like "r-1") it will be an array of length 0
    if ((tile_above.length > 0) && (tile_above.attr("data-val") == val)) {
      console.log("there are still moves up");
      // $("#message").text("there are still moves up");
      break;
    } else if ((tile_below.length > 0) && (tile_below.attr("data-val") == val)) {
      console.log("there are still moves down");
      // $("#message").text("there are still moves down");
      break;
    } else if ((tile_right.length > 0) && (tile_right.attr("data-val") == val)) {
      console.log("there are still moves right");
      // $("#message").text("there are still moves right");
      break;
    } else if ((tile_left.length > 0) && (tile_left.attr("data-val") == val)) {
      console.log("there are still moves left");
      // $("#message").text("there are still moves left");
      break;
    } else {
      console.log("you lose!");
      $("#message").text("GAME OVER");
    }

  } // end for loop
} // end checkPossibleMoves
