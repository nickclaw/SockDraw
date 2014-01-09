SockDraw.createHotkeyButton = function(key, description, fn) {
	var element = $('<div>');

	$(document.body)
		.on('keydown', function(evt) {
			if ( key === String.fromCharCode(evt.originalEvent.keyCode) ) fn.apply(this, arguments);
		});

	return element
		.addClass('hotkey')
		.text(key)
		.attr('data-description', description)
		.on('click', fn);
}