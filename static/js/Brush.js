(function() {
	var app = {};
	if (this.SockDraw) {
		app = this.SockDraw;
	} else {
		this.SockDraw = app;
	}

	var size = 400,
		canvas = $('<canvas>').attr('height', size).attr('width', size)[0],
		ctx = canvas.getContext('2d');

	ctx.translate(size/2, size/2);

	app.brushes = {
		create : function(options) {
			var	options = options || {},
				width = options.width || 1,
				height = options.height || 1,
				rotate = options.rotate || 0,
				scale = options.scale || 20,
				blur = options.blur || 0,
				color = options.color || [0,0,0,255],
				img = new Image();

			// create gradient
			var grad = ctx.createRadialGradient(0,0, scale * blur, 0, 0, scale);
			grad.addColorStop(0, 'rgba(' + color.slice(0, 3).join(',') + ', 1)');
			grad.addColorStop(1, 'rgba(' + color.slice(0, 3).join(',') + ', 0)');

			// draw brush
			ctx.save();
				ctx.rotate(Math.PI / 4);
				ctx.scale(width, height);
				ctx.fillStyle = grad;
				ctx.fillRect(-size/2,-size/2,size,size);
				img.src = canvas.toDataURL();
			ctx.restore();
			ctx.clearRect(-size/2,-size/2,size,size);

			// return object
			return {
				image : img,
				options : {
					width : width,
					height : height,
					rotate : rotate,
					size : size,
					blur : blur,
					color : color
				}
			}
		},

		update : function(original, options) {
			var newOptions = app.util.mergeObjects(original.options, options);
			return this.create(newOptions);
		},

		presets : {}
	}

	app.brushes.presets.default = app.brushes.create();

	console.log('loaded brushes');
})();