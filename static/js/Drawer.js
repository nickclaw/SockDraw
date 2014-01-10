(function() {
	var app = {};
	if (this.SockDraw) {
		app = this.SockDraw;
	} else {
		this.SockDraw = app;
	}

	var	canvas = document.createElement('canvas')
		brushElement = $('<div>')
		ctx = canvas.getContext('2d'),
		drawer = null,
		history = {};

	app.drawer = {
		init : function() {

			$(document.body)
				.append(
					$(canvas)
						.attr('width', window.innerWidth)
						.attr('height', window.innerHeight),
					brushElement
						.attr('id', 'brush')
						.css('top', '-1000px')
						.css('left', '-1000px')
				)
				.on('mousemove', function(evt) {
					brushElement
						.css('top', evt.clientY)
						.css('left', evt.clientX)
				});

		},

		getInstance : function(user, ondraw) {
			var drawer = this,
				isLocal = user.isLocal(),
				id = user.getId();

			// if user has not been seen before create instance
			if (!history[id]) {

				history[id] = {
					user : user,
					lastPoint : null
				}

				// if user is local attach listeners
				if (isLocal) {
					var isDrawing = false;

					$(canvas)
						.on('mousedown', function(evt) {
							isDrawing = true;

							if (isDrawing) {
								var point = Point.createPoint(evt.clientX, evt.clientY, 'start');
								drawer.drawPoint(point, history[id]);
								ondraw(point);
							}
						})
						.on('mousemove', function(evt) {
							if (isDrawing) {
								var point = Point.createPoint(evt.clientX, evt.clientY, 'point');
								drawer.drawPoint(point, history[id]);
								ondraw(point);
							}
						})
						.on('mouseup', function(evt) {
							isDrawing = false;
						});
				}
			}

			return {
				draw : function(point) {
					drawer.drawPoint(point, history[id]);
				},

				updateBrush : function(brush) {
					brushElement
						.css("background-image", 'url(' + brush.image.src + ')');
				}
			}

			return (function(h) {
				return function(point) {
					drawer.drawPoint(point, h);
				}
			})(history[id]);

		},

		drawPoint : function(point, history) {
			var drawer = this;

			if (history.lastPoint && point.type === 'point') {
				drawer.drawLine(history.lastPoint, point, history.user.brush());
			} else if (point.type === 'start') {
				drawer.drawLine(point, Point.createPoint(point.x + .01, point.y + .01), history.user.brush());
			}
			history.lastPoint = point;
		},

		drawLine : function(point1, point2, brush) {
			var dist = Point.distance(point1, point2),
				angle = Point.angle(point1, point2);

			for (var i = 0; i < dist; i+=3) {
				ctx.drawImage(
						brush.image,
						point1.x + (Math.sin(angle) * i) - 25 - brush.image.width / 2 + 25,
						point1.y + (Math.cos(angle) * i) - 25 - brush.image.height / 2 + 25
					);
			}
		}
	}

	console.log('loaded drawer');
})();