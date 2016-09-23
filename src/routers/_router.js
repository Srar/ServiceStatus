const express = require("express");

module.exports = function(app, config){

	function setRouter(routerPath, filePath) {
		app.use(routerPath, require(filePath)(
			express.Router()));
	}

	setRouter("/", "./home.js");
};