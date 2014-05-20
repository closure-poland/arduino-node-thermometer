var http = require('http');
var express = require('express');
var page_server = express();
var http_server = http.createServer(page_server);
page_server.use(express.static(__dirname));

var io = require('socket.io').listen(http_server);

var widget_config = {
	temp: '<p class="temperature">$temp °C</p>'
	//light: '<p class="light">$light / 1023</p>',
};

var serialport = require("serialport");
var SerialPort = serialport.SerialPort; // localize object constructor  
var sp = new SerialPort("/dev/ttyACM0", {
	parser: serialport.parsers.readline("\n"),
	baudrate: 9600
});
var client_sockets = [];

var data_handlers = {
	'temp': function(args){
		var temperature = parseFloat(args[1]).toFixed(1);
		return {
			temp: temperature,
		};
	},
	'light': function(args){
		var light = parseInt(args[1]);
		return {
			"light": light,
		};
	}
};

sp.on('data', function(line){
	console.log('Got a line:', line);
	var args = line.split(':');
	if(typeof(data_handlers[args[0]]) === 'undefined'){
		return true; //no-op, no handler for rubbish data with no application identifier
	}
	
	var parsed_data = data_handlers[args[0]](args);
	for(var i = 0; i<client_sockets.length; i++){
			client_sockets[i].emit('widget_update', {widget_name: args[0], widget_data: parsed_data});
	}
});

io.sockets.on('connection', function (socket) {
	client_sockets.push(socket);
	socket.emit('widget_config', widget_config);
});

http_server.listen(1337);
