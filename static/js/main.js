;$(function() {
	var socket = io.connect('/')
		drawPanel = SockDraw.createCanvas(dispatchPoint),
		global = null,
		user = null;

	$('#hotkeys')
		.append(
			SockDraw.createHotkeyButton('B', 'change brush', function(evt) {
				console.log('brush');
			}),
			SockDraw.createHotkeyButton('C', 'change color', function(evt) {
				console.log('color');
			}),
			SockDraw.createHotkeyButton('H', 'change size', function(evt) {
				console.log('hide');
			}),
			SockDraw.createHotkeyButton('S', 'change size', function(evt) {
				console.log('size');
			})

		)

	socket.on('updatestate', function(data) {
		console.log('updatestate', data);

		global = data.room;
		user = drawPanel.users.create(data.you);
		drawPanel.users.setLocal(user);

		$.each(data.peers, function(index, id) {
			drawPanel.users.create(id);
		});

		applyListeners(socket);
	});	

	function dispatchPoint(point) {
		socket.emit('message', {
			to : null,
			from : user.getId(),
			points : [point]
		});
	}
});

function applyListeners(socket) {
	socket.on('newuser', function(data) {
		console.log('newuser', data);

		drawPanel.users.create(data.id);
	});

	socket.on('message', function(data) {
		console.log('message', data);

		var sender = drawPanel.users.get(data.from);
		if (sender) {
			sender.drawPoints(data.points);
		}
	});
}