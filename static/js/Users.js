(function() {
	var app = {};
	if (this.SockDraw) {
		app = this.SockDraw;
	} else {
		this.SockDraw = app;
	}

	var users = {};

	app.users = {
		create : function(id, isLocal) {
			var brush = app.brushes.presets.default;

			users[id] = {
				getId : function() {
					return id;
				},
				brush : function(newBrush) {
					if (newBrush !== undefined) {
						brush = newBrush;
					} else {
						return brush;
					}
				},
				isLocal : function() {
					return isLocal;
				}
			}

			users[id].draw = app.drawer.getInstance(users[id], function(point) {
				app.util.sendMessage('newpoint', {
					point : point
				});
			});

			return users[id];
		},

		get : function(id) {
			if (id) {
				return users[id];
			} else {
				return users;
			}
		},

		remove : function(id) {
			delete users[id];
		}
	}

	console.log('loaded users');

})();