(function() {
	var app = this.SockDraw = this.SockDraw || {};

	var users = {};

	app.users = {
		create : function(id, isLocal) {
			var brush = null;

			users[id] = {
				getId : function() {
					return id;
				},
				brush : function(newBrush) {
					if (newBrush !== undefined) {
						brush = newBrush;

						if (this.isLocal()) {
							this.drawInstance.updateBrush(brush);
						}

					} else {
						return brush;
					}
				},
				isLocal : function() {
					return isLocal;
				}
			}

			users[id].drawInstance = app.drawer.getInstance(users[id], function(point) {
				app.util.sendMessage('newpoint', {
					point : point
				});
			});

			users[id].brush(app.brushes.presets.default);

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