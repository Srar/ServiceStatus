/* @flow */

import SerivceReportModel from "../models/SerivceReportModel.js";

export default class TcpConnect {
    reportStatus(target: any): SerivceReportModel {
        return new SerivceReportModel(false);
    }

    getCheckTimerLimit(): number {
        return 7;
    }
}