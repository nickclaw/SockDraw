SockDraw.createCanvas = function(ondraw) {
	var canvas = document.createElement('canvas'),
		ctx = canvas.getContext('2d')
		drawers = {},
		local = null,
		isDrawing = false;
	
	var exports = {
		users : {
			create : function(id) {
				var id = id,
					points = [],
					lastPoint = null,
					brush = SockDraw.brush.presets.default;

				var exports = {
					getId : function() {
						return id;
					},
					getPoints : function() {
						return points;
					},
					brush : function(newBrush) {
						if (newBrush !== undefined) {
							brush = newBrush;
						} else {
							return brush;
						}
					},
					drawPoint : function(point) {
						if (lastPoint && point.type === 'point') {
							this.drawLine(lastPoint, point);
						} else if (point.type === 'start') {
							this.drawLine(point, Point.createPoint(point.x + .01, point.y + .01));
						}
						lastPoint = point;
						points.push(point);
					},
					drawPoints : function(newPoints) {
						for (var i = 0, point = null; point = newPoints[i]; i++) {
							this.drawPoint(point);
						}
					},
					drawLine : function(point1, point2) {
						var dist = Point.distance(point1, point2),
							angle = Point.angle(point1, point2);

						for (var i = 0; i < dist; i+=1) {
							ctx.drawImage(
									brush.image,
									point1.x + (Math.sin(angle) * i) - 25 - brush.image.width / 2 + 25,
									point1.y + (Math.cos(angle) * i) - 25 - brush.image.height / 2 + 25
								);
						}
					}
				}

				drawers[id] = exports;
				return exports;
			},

			setLocal : function(user) {
				local = user;
				return this;
			},

			get : function(id) {
				return drawers[id];
			},

			remove : function(id) {
				if (drawers[id]) delete drawers[id];
			}
		},
	};

	$(canvas)
		.attr('width', window.innerWidth)
		.attr('height', window.innerHeight)
		.on('resize load', function(evt) {
			$(this)
				.attr('width', window.innerWidth)
				.attr('height', window.innerHeight);
		})
		.on('mousedown', function(evt) {
			isDrawing = true && local;

			if (isDrawing) {
				var point = Point.createPoint(evt.clientX, evt.clientY, 'start');
				local.drawPoint(point);
				ondraw(point);
			}
		})
		.on('mousemove', function(evt) {
			if (isDrawing) {
				var point = Point.createPoint(evt.clientX, evt.clientY, 'point');
				local.drawPoint(point);
				ondraw(point);
			}
		})
		.on('mouseup', function(evt) {
			isDrawing = false;
		});

	$(document.body).append(canvas);

	// return an object full of closures to interact with the canvas
	return exports;
}