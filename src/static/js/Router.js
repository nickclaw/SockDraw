(function() {
	var app = this.SockDraw = this.SockDraw || {};

	var routes = {};

	app.router = {
		route : function(message) {

			console.log('--> '+message.type)

			var functions = routes[message.type] || [];
			for (var i = 0, fn = null; fn = functions[i]; i++) {
				fn(message);	
			}
		},
		addRoute : function(type, fn) {
			if (routes[type]) {
				routes[type].push(fn);
			} else {
				routes[type] = [fn];
			}
		}
	}

	console.log('loaded router');
})();