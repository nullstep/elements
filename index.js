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
var players_list = [];
var move_list = [];
var tile_deck = [];
var player_hands = [];

var stack = [];

var player_turn = 0;
var board_season = 0;
var move_count = 0
var player_count = 2;
var board_size = 0;

// routing

app.get('/get_board', (req, res) => {
	output = current_board;
	res.send(output);
});

app.get('/new_board/:size', (req, res) => {
	output = new_board(req.params.size);
	res.send(output);
});

app.get('/place_tile/:player/:x/:y/:tile', (req, res) => {
	output = place_tile(req.params.player, req.params.x, req.params.y, req.params.tile);
	res.send(output);
});

app.get('/set_players/:num', (req, res) => {
	output = set_number_of_players(req.params.num);
	res.send(output);
});

app.listen(port, () => {
	console.log(`listening on port ${port}`);
});

// methods

function check_args(args) {
	var result = true;
	args.forEach((arg, i) => function(x) {
		if (x == null) {
			result = false;
		}
	});
	return result;
}

function new_board(size) {
	var row;
	current_board = [];
	for (var y = 0; y < size; y++) {
		row = [];
		for (var x = 0; x < size; x++) {
			row.push(' ');
		}
		current_board.push(row);
	}
	board_size = size;
	return ok('board set');
}

function set_number_of_players(num) {
	if (move_count = 0) {
		for (var x = 0; x < num; x++) {
			players.push(x + 1);
		}
		player_count = num;
		return ok('number of players set');
	}
	else {
		return error('game already started');
	}
}

function is_move_legal(x, y, tile) {
	return true;
}

function place_tile(player, x, y, tile) {
	if (player == player_turn) {
		if (is_move_legal(x, y, tile)) {
			move_list.push({
				'player': player,
				'x': (x - 1),
				'y': (y - 1),
				'tile': tile
			});
			current_board[x][y] = player.toString() + tile;
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

function set_player_turn() {
	player_turn++
	if (player_turn > (player_count - 1)) {
		player_turn = 0;
	}
}

// engine

// render

function generate_board() {
	return '';
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