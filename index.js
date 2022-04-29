//     ▄████████   ▄█           ▄████████    ▄▄▄▄███▄▄▄▄       ▄████████  ███▄▄▄▄▄        ███         ▄████████  
//    ███    ███  ███          ███    ███  ▄██▀▀▀███▀▀▀██▄    ███    ███  ███▀▀▀▀██▄  ▀█████████▄    ███    ███  
//    ███    █▀   ███          ███    █▀   ███   ███   ███    ███    █▀   ███    ███     ▀███▀▀██    ███    █▀   
//   ▄███▄▄▄      ███         ▄███▄▄▄      ███   ███   ███   ▄███▄▄▄      ███    ███      ███   ▀    ███         
//  ▀▀███▀▀▀      ███        ▀▀███▀▀▀      ███   ███   ███  ▀▀███▀▀▀      ███    ███      ███      ▀███████████  
//    ███    █▄   ███          ███    █▄   ███   ███   ███    ███    █▄   ███    ███      ███               ███  
//    ███    ███  ███▌    ▄    ███    ███  ███   ███   ███    ███    ███  ███    ███      ███         ▄█    ███  
//    ██████████  █████▄▄██    ██████████   ▀█   ███   █▀     ██████████   ▀█    █▀      ▄████▀     ▄████████▀   

const express = require('express');
const app = express();
const port = 3000;

// globals

var current_board = [];
var player_list = [];
var move_list = [];
var tile_deck = [];

var stack = [];

var player_turn = 0;
var board_season = 0;
var board_size = 0;

// routing

app.get('/', (req, res) => {
    res.sendFile('./index.html', { root: __dirname });
});

app.get('/get_board', (req, res) => {
	output = current_board;
	res.send(output);
});

app.get('/new_board/:size', (req, res) => {
	output = new_board(
		req.params.size
	);
	res.send(output);
});

app.get('/place_tile/:player/:x/:y/:tile', (req, res) => {
	output = place_tile(
		Number(req.params.player) - 1,
		Number(req.params.x) - 1,
		Number(req.params.y) - 1,
		req.params.tile
	);
	res.send(output);
});

app.get('/set_players/:num', (req, res) => {
	output = set_players(
		req.params.num
	);
	res.send(output);
});

app.listen(port, () => {
	console.log(`listening on port ${port}`);
});

// api functions

function new_board(size) {
	var row;
	current_board = [];
	player_list = [];
	move_list = [];

	for (var y = 0; y < size; y++) {
		row = [];

		for (var x = 0; x < size; x++) {
			row.push({
				'state': null,
				'owner': null,
				'tile': null,
				'effect': null
			});
		}

		current_board.push(row);
	}

	board_size = size;
	return ok('board set');
}

function set_players(num) {
	if (get_move_count() == 0) {
		for (var x = 0; x < num; x++) {
			player_list.push({
				'id': x + 1,
				'name': '',
				'score': 0,
				'deck': generate_deck(),
				'mana': [
					'earth': 0,
					'fire': 0,
					'water': 0
				]
			});
		}

		return ok('number of players set');
	}
	else {
		return error('game already started');
	}
}

function place_tile(player, x, y, tile) {
	if (player == player_turn) {
		if (is_move_legal(x, y, tile)) {
			move_list.push({
				'player': player,
				'x': x,
				'y': y,
				'tile': tile
			});

			var space = current_board[x][y];

			space.owner = player;
			space.tile = tile;
			
			current_board[x][y] = space;
			move_count++;
			set_player_turn();

			return ok('tile placed');
		}
		else {
			return error('illegal move');		
		}
	}
	else {
		return error('wrong player');		
	}
}

// internal functions

function is_move_legal(x, y, tile) {
	return true;
}

function set_player_turn() {
	player_turn++;

	if (player_turn > (get_player_count() - 1)) {
		player_turn = 0;
	}
}

function generate_deck() {
	return ['e', 'f', 'w'];
}

function get_player_count() {
	return player_list.length;
}

function get_move_count() {
	return move_list.length;
}

// engine

function get_next_move() {
	return {
		'x': 0,
		'y': 0,
		'tile': 'e'
	}
}

// helpers

function error(message) {
	return {
		'status': 'error',
		'message': message
	};
}

function ok(message) {
	return {
		'status': 'ok',
		'message': message
	};	
}

// EOF