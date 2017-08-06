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
                var report = new SerivceReportModel(false);
                if (err) {
                    report.setMessage("error", err.toString());
                    success(report);
                    return;
                }
                try {
                    var response = JSON.parse(res.text);
                    if (response["offline"] === undefined || response["offline"] === true) {
                        report.setMessage("error", "jenkins node offline.");
                        success(report);
                        return;
                    }
                } catch (error) {

                }

                var endTime: number = Date.now();
                var time: number = endTime - startTime;

                report.setStatus(true);
                report.setMessage("time", time.toString());
                success(report);
            });
    });
}

export default class JenkinsNode {

    async reportStatus(taskModel: ServiceTaskModel): Promise<SerivceReportModel> {
        var url: string = "";

        if (taskModel.Target["url"] == undefined) {
            console.error(`[JenkinsNode] target url undefined.`);
            return new SerivceReportModel(false);
        }

        url = taskModel.Target["url"];

        return await _test(url);
    }

    getCheckTimerLimit(): number {
        return 5;
    }
}