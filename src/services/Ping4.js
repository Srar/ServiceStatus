/* @flow */

import dns from "dns";
import netPing from "net-ping";
import SerivceReportModel from "../models/SerivceReportModel.js";
import type { ServiceTaskModel } from "../models/ServiceTaskModel.js";

var options = {
    retries: 3,
    timeout: 1000 * 5
};
var session = netPing.createSession(options);

function _validateIPaddress(ip) {
    return /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(ip);
}

function _test(host): Promise<SerivceReportModel> {
    return new Promise(async function (success) {
        var ip = host;
        var reportModel = new SerivceReportModel(false);
        var ips: Array<string> = [];
        // console.log(_validateIPaddress(ip), ip);
        if (!_validateIPaddress(ip)) {
            try {
                ips = await resolveDomain(host);
                if (ips.length == 0) {
                    throw `[Ping4] Can't resolve domain ${host}`;
                }
                ip = ips[0];
            } catch (err) {
                reportModel.setMessage("error", err.toString());
                success(reportModel);
            }
        }
        
        session.pingHost(ip, function (err, target, sent, rcvd) {
            var ms = rcvd - sent;
            if (err) {
                reportModel.setMessage("error", err.toString());
                success(reportModel)
            } else {
                reportModel.setStatus(true);
                reportModel.setMessage("time", ms.toString());
                success(reportModel)
            }
        });
    });
}

async function resolveDomain(domain): Promise<Array<string>> {
    return new Promise((success, error) => {
        dns.resolve4(domain, (err, addresses) => {
            if (err) {
                return error(err);
            }
            success(addresses);
        });
    });
}

export default class Ping4 {
    async reportStatus(taskModel: ServiceTaskModel): Promise<SerivceReportModel> {
        var host: string = "";
        var port: number = -1;

        if (taskModel.Target["host"] == undefined) {
            console.error(`[Ping4] target host undefined.`);
            return new SerivceReportModel(false);
        }

        host = taskModel.Target["host"];

        return await _test(host);
    }

    getCheckTimerLimit(): number {
        return 5;
    }
}