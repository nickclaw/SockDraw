;$(function() {
	var socket = io.connect('http://localhost:8888');
	console.log(socket);

	socket.on('updatestate', function(data) {
		console.log(data);
	});

	socket.on('message', function(data) {
		console.log(data);
	});
});