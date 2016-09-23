/* @flow */

import SerivceReportModel from "../models/SerivceReportModel.js";
import type { ServiceTaskModel } from "../models/ServiceTaskModel.js";

var superagent = require('superagent');
require('superagent-proxy')(superagent);

function _test(url: string, proxy: string): Promise<SerivceReportModel> {
    return new Promise((success, error) => {
        var startTime: number = Date.now();
        superagent
            .get(url)
            .proxy(proxy)
            .timeout(1000 * 6)
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

export default class HttpProxy {

    async reportStatus(taskModel: ServiceTaskModel): Promise<SerivceReportModel> {
        var host: string = "";
        var port: number = -1;

        if (taskModel.Target["host"] == undefined) {
            console.error(`[HttpProxy] target host undefined.`);
            return new SerivceReportModel(false);
        }
        if (taskModel.Target["port"] == undefined) {
            console.error(`[HttpProxy] target port undefined.`);
            return new SerivceReportModel(false);
        }

        host = taskModel.Target["host"];
        port = parseInt(taskModel.Target["port"]);

        return await _test("https://status.github.com/", `http://${host}:${port}`);
    }

    getCheckTimerLimit(): number {
        return 7;
    }
}