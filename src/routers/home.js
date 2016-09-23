/* @flow */

import type { ServiceModel } from "../models/ServiceModel.js";
import type { ServiceTaskModel } from "../models/ServiceTaskModel.js";
import type { ServiceStatusModel } from "../models/ServiceStatusModel.js";
import ServicesProcess from "../services/_ServicesProcess.js";

module.exports = function (router: Object) {

	router.get("/", async function (req, res) {
		var ServicesList: Array<ServiceModel> = ServicesProcess.getAllTasksSerivceModels();

		res.render("home", {
			ServicesList: ServicesList
		});
	});
	
	return router;
};