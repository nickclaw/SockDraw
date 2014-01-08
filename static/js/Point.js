Point = {
	createPoint: function(x, y, type) {
		return {
			x : x || 0,
			y : y || 0,
			type : type || 'point',
			timestamp : new Date().valueOf()
		}
	},

	midPoint: function(points) {
		var pointCount = 0,
			x = 0,
			y = 0;
		$.each(points, function(index, value) {
			x += value.x;
			y += value.y;
			pointCount++;
		});

		if (pointCount > 0) {
			return this.createPoint(x / pointCount, y / pointCount);
		} else {
			throw "No points to find midpoint with.";
		}
	},

	distance : function(point1, point2) {
		return Math.sqrt( Math.pow(point2.x - point1.x, 2) + Math.pow(point2.y - point1.y, 2) );
	},

	angle : function(point1, point2) {
  		return Math.atan2( point2.x - point1.x, point2.y - point1.y );
  	}
}