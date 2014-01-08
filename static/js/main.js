;$(function() {
	$(window).on('resize load', sizeCanvas);	

	// create sockets
	var socket = io.connect('http://localhost:8888')
		id = null,
		peers = {},
		canvas = document.getElementById('draw'),
		ctx = canvas.getContext('2d'),
		user = newUser(socket.id, ctx),
		isDrawing = false
		isConnected = false;

	socket.on('updatestate', function(data) {
		// save data
		id = data.you;		
		$.each(data.peers, function(index, id) {
			peers[id] = newUser(id, ctx)
		});
		isConnected = true;
	});

	socket.on('newuser', function(data) {
		peers[data.id] = newUser(data.id, ctx);
	});

	socket.on('message', function(data) {
		console.log(peers, data.from);
		var peer = peers[data.from]
		if (peer && isConnected) {
			for (var i = 0; i < data.points.length; i++) {
				peer.drawPoint(data.points[i]);
			}
		}
	});

	$("#draw")
		.on('mousedown', function(evt) {
			isDrawing = isConnected && true;

			if (isDrawing) {
				var point = Point.createPoint(evt.clientX, evt.clientY, 'start');

				user.drawPoint(point);

				socket.emit('message', {
					from : id,
					to : null,
					points : [point]
				});
			}
		})
		.on('mousemove', function(evt) {
			if (isDrawing && isConnected) {
				var point = Point.createPoint(evt.clientX, evt.clientY, 'point');

				user.drawPoint(point);

				socket.emit('message', {
					from : id,
					to : null,
					points : [point]
				});
			}
		})
		.on('mouseup', function(evt) {
			isDrawing = false;
		});
});

function setup() {

}

function sizeCanvas() {
	$('#draw')
		.attr('width', window.innerWidth)
		.attr('height', window.innerHeight);
}

function newUser(id, context) {
	var points = [],
		lastPoint = null,
		ctx = context,
		img = new Image();

	img.src = 'http://www.tricedesigns.com/wp-content/uploads/2012/01/brush2.png';

	return {
		drawPoint : function(point) {
			if (lastPoint && point.type === 'point') {

				var dist = Point.distance(lastPoint, point),
					angle = Point.angle(lastPoint, point);

				for (var i = 0; i < dist; i+=1) {

					ctx.drawImage(
							img,
							lastPoint.x + (Math.sin(angle) * i) - 25,
							lastPoint.y + (Math.cos(angle) * i) - 25
						);
				}
			}
			lastPoint = point;
			points.push(point);
		},

		exportPoints : function() {
			return points;
		},

		importPoints : function(points) {
			var self = this;
			$.each(points, function(index, point) {
				self.draw(point);
			});
		}
	}

}