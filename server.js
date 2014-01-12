var PORT = 8888;

var express = require('express'),
	app = express(),
	server = require('http').createServer(app),
	io = require('socket.io').listen(server);

app.use(express.compress());
app.use('/', express.static(__dirname + '/build/static'));

var comm = io.sockets.on('connection', function(socket) {
	console.log('user ' + socket.id + ' connected...');

	// forward messages
	socket.on('message', function(data) {
		console.log(data);
		if (data.to) {

		} else {
			socket.broadcast.emit('message', data);
		}
	});
});

server.listen(PORT);
console.log('listening on port ' + PORT);