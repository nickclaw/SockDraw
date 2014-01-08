var PORT = 8888;

var express = require('express'),
	app = express(),
	server = require('http').createServer(app),
	io = require('socket.io').listen(server);

app.use(express.compress());
app.use('/', express.static(__dirname + '/static'));

var comm = io.sockets.on('connection', function(socket) {
	console.log('user ' + socket.id + ' connected...');
	console.log(comm);

	// send initial data
	socket.emit('updatestate', {
		you : socket.id,
		room : 'global',
		peers : getPeerIds(socket)
	});

	// forward messages
	socket.on('message', function(data) {
		if (data.to) {

		} else {
			socket.broadcast.emit('message', data);
		}
	});
});

server.listen(PORT);
console.log('listening on port ' + PORT);

function getPeerIds(socket) {
	return Object.keys.call(null, comm.manager.roomClients).filter(function(id) {
		return id !== socket.id;
	});
}