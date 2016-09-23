var Cache = {};
setInterval(() => {
	Object.keys(Cache).forEach((key) => {
		var obj = Cache[key];
		obj.time--;
		if (obj.time <= 0) delete Cache[key];
	});
}, 1000);

module.exports = (req, res, next) => {
	req.cache = {};
	req.cache.set = (key, obj, time) => {
		if(time == undefined) time = 10;
		Cache[key] = { time: time, data: obj }
	};
	req.cache.get = (key) => {
		return Cache[key] ? Cache[key].data : null;
	};
	req.cache.remove = (key) => {
		if (Cache[key]) delete Cache[key];
	};
	next();
}