const express = require("express");
const path = require("path");
const logger = require("morgan");
const bodyParser = require("body-parser");
const config = require("./config.js");
const fs = require("fs");
const app = express();

console.log("loadding services...")
const services = require("./services/_Services.js");
services.default.loadServices();
console.log("init services process...");
const servicesProcess = require("./services/_ServicesProcess.js");
servicesProcess.default.loadTargets()

app.use(require("compression")());
app.engine(".ejs", require("ejs").__express);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(logger("dev"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

app.use(require("./middlewares/date.js"));
app.use(require("./middlewares/memory-cache.js"));

app.use((req, res, next) => {
	req.config = config;
	res.error = (result) => res.json({ "status": false, "result": result });
	res.success = (result) => res.json({ "status": true, "result": result });
	res.catch = (error) => {
		console.error(error);
		res.json({ "status": false, "message": "服务器错误, 请稍后重试。" }).end();
	};
	next();
});

require("./routers/_router.js")(app, config);

app.use((req, res) => res.status(404).send("页面未找到."));

app.use((err, req, res) => {
	console.error(err);
	res.status(503).send("服务器错误.");
});

process.on("uncaughtException", (err) => console.error(err));

app.listen(config.HTTP_PORT, (error) => {
	if (error) {
		return console.error("Listening error:", error);
	}
	console.log("Listening port:", config.HTTP_PORT);
});