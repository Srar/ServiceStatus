/* @flow */

import net from "net";
import SerivceReportModel from "../models/SerivceReportModel.js";
import type { ServiceTaskModel } from "../models/ServiceTaskModel.js";

function _test(host, port, timeout): Promise<SerivceReportModel> {
    return new Promise((success) => {
         var startTime: number = Date.now();

        var client = new net.Socket();
        client.setTimeout(timeout);
        client.connect({
            host: host,
            port: port
        }, function () {
            try {
                client.end();
            } catch (error) { }
            try {
                client.destroy();
            } catch (error) { }
            var report = new SerivceReportModel(true);
            report.setMessage("time", (Date.now() - startTime).toString());
            success(report);
        });
        client.on('error', function (err) {
            try {
                client.destroy();
            } catch (error) { }
            var report = new SerivceReportModel(false);
            report.setMessage("error", err.toString());
            success(report);
        });
    });
}

export default class TcpConnect {
    async reportStatus(taskModel: ServiceTaskModel): Promise<SerivceReportModel> {
        var host: string = "";
        var port: number = -1;

        if (taskModel.Target["host"] == undefined) {
            console.error(`[TcpConnect] target host undefined.`);
            return new SerivceReportModel(false);
        }
        if (taskModel.Target["port"] == undefined) {
            console.error(`[TcpConnect] target port undefined.`);
            return new SerivceReportModel(false);
        }

        host = taskModel.Target["host"];
        port = parseInt(taskModel.Target["port"]);

       return await _test(host, port, 5 * 1000);
    }

    getCheckTimerLimit(): number {
        return 5;
    }
}