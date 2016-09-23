/* @flow */

import SerivceReportModel from "../models/SerivceReportModel.js";
import type { ServiceTaskModel } from "../models/ServiceTaskModel.js";

var superagent = require('superagent');

function _test(url: string): Promise<SerivceReportModel> {
    return new Promise((success, error) => {
        var startTime: number = Date.now();
        superagent
            .get(url)
            .timeout(1000 * 5)
            .end((err, res) => {
                if (err) {
                    var report = new SerivceReportModel(false);
                    report.setMessage("error", err.toString());
                    success(report);
                    return;
                }
                var endTime: number = Date.now();
                var time: number = endTime - startTime;

                var report: SerivceReportModel = new SerivceReportModel(true);
                report.setMessage("time", time.toString());
                success(report);
            });
    });
}

export default class HttpGet {

    async reportStatus(taskModel: ServiceTaskModel): Promise<SerivceReportModel> {
        var url: string = "";

        if (taskModel.Target["url"] == undefined) {
            console.error(`[HttpGet] target url undefined.`);
            return new SerivceReportModel(false);
        }

        url = taskModel.Target["url"];

        return await _test(url);
    }

    getCheckTimerLimit(): number {
        return 5;
    }
}