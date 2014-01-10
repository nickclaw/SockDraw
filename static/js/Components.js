(function() {
	var app = {};
	if (this.SockDraw) {
		app = this.SockDraw;
	} else {
		this.SockDraw = app;
	}

	app.components = {
		color : function(fn) {
			var element = $('<div><canvas></canvas></div>')
					.attr('id', 'color')
					.addClass('module'),
				image = document.createElement('img'),
				canvas = element.find('canvas')
					.attr('width', '400px')
					.attr('height', '400px'),
				ctx = canvas[0].getContext('2d');

			canvas.click(function(evt) {
				var rgba = ctx.getImageData(evt.offsetX, evt.offsetY,1,1);
				fn([].map.call(rgba.data, function(value) {
					return value;
				}));
				element.remove();
				$('#overlay').addClass("hidden");
			});

			image.onload = function() {
				ctx.drawImage(image, 0,0);
				$('#overlay').removeClass('hidden');
				$('#modules').append(element);

			}
			image.src = '../image/color_grid_400.jpg';

		}
	}

	console.log('loaded components');
})();