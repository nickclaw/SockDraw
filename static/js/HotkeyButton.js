(function() {
	var app = {};
	if (this.SockDraw) {
		app = this.SockDraw;
	} else {
		this.SockDraw = app;
	}

	app.createHotkeyButton = function(letter, code, description, fn) {
		var element = $('<div>');

		$(document.body)
			.on('keydown', function(evt) {
				if ( code === evt.which ) fn.apply(this, arguments);
			});

		return element
			.addClass('hotkey')
			.addClass('tooltip')
			.addClass('select')
			.text(letter)
			.attr('data-tip', description)
			.on('click', fn);
	}

	console.log('loaded hotkey');
})();