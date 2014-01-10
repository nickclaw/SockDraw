(function() {
	var app = this.SockDraw = this.SockDraw || {};

	app.init = function() {
		// create socket
		app.socket = io.connect('/');
		app.socket.on('connect', function() {

			addUI();

			app.user = app.users.create(app.socket.socket.sessionid, true);

			addRoutes();

			app.util.sendMessage('hi_i_am_new', {
				brush_settings : app.user.brush().options,
			});

			console.log('sockdraw ready');
		});

		console.log('sockdraw initiated');
	}

	app.util = {
		sendMessage : function(type, data) {
			console.log('<-- ' + type);
			app.socket.emit('message', {
				type : type,
				to : null,
				from : app.user.getId(),
				data : data
			});
		},

		userFromMessage : function(message) {
			var brush = app.brushes.create(message.data.brush_settings);
			app.users.create(message.from, false).brush(brush);
		},

		mergeObjects : function(obj1,obj2){
		    var obj3 = {};
		    for (var attrname in obj1) { obj3[attrname] = obj1[attrname]; }
		    for (var attrname in obj2) { obj3[attrname] = obj2[attrname]; }
		    return obj3;
		},

		updateUsersBrush : function(user, options) {
			var newBrush = app.brushes.update(user.brush(), options);
			user.brush(newBrush);

			// if use is local broadcast the change
			if (user.isLocal()) {
				app.util.sendMessage('newbrush', {
					brush_settings : newBrush.options
				});
			}

			return newBrush;
		}
	}

	function addRoutes() {
		app.socket.on('message', function(data) {
			app.router.route(data);
		});

		app.router.addRoute('hi_welcome', function(message) {
			app.util.userFromMessage(message);
		});

		app.router.addRoute('hi_i_am_new', function(message) {
			app.util.userFromMessage(message);
			app.util.sendMessage('hi_welcome', {
				brush_settings : app.user.brush().options,
			});
		});

		app.router.addRoute('newpoint', function(message) {
			app.users.get(message.from).drawInstance.draw(message.data.point);
		});

		app.router.addRoute('newbrush', function(message) {
			var brush = app.brushes.create(message.data.brush_settings);
			app.users.get(message.from).brush(brush);
		});
	}

	function addUI() {
		app.drawer.init();

		$('#hotkeys').append(
			app.createHotkeyButton('H', 72, 'hide ui', function() {
				console.log('hiding ui');
				$('#ui').toggle();
			}),
			app.createHotkeyButton('c', 67, 'change color', function() {
				app.components.color(function(color) {
					var brush = app.util.updateUsersBrush(app.user, {
						color : color
					});
				});
			}),
			app.createHotkeyButton('-', 189, 'decrease size', function() {
				var currentBrush = app.user.brush();
				var brush = app.util.updateUsersBrush(app.user, {
					scale : currentBrush.options.scale - 10
				});
			}),
			app.createHotkeyButton('=', 187, 'increase size', function() {
				var currentBrush = app.user.brush();
				var brush = app.util.updateUsersBrush(app.user, {
					scale : currentBrush.options.scale + 10
				});
			}),
			app.createHotkeyButton('[', 219, 'increase size', function() {
				var currentBrush = app.user.brush();
				var brush = app.util.updateUsersBrush(app.user, {
					blur : currentBrush.options.blur - .1
				});
			}),
			app.createHotkeyButton(']', 221, 'increase size', function() {
				var currentBrush = app.user.brush();
				var brush = app.util.updateUsersBrush(app.user, {
					blur : currentBrush.options.blur + .1
				});
			})
		);
	}

	console.log('loaded sockdraw');
})();