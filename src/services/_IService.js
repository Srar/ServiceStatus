/* @flow */

import SerivceReportModel from "../models/SerivceReportModel.js";
import type { ServiceTaskModel } from "../models/ServiceTaskModel.js";

export interface IService {
    reportStatus(taskModel: ServiceTaskModel): SerivceReportModel;
    getCheckTimerLimit(): number;
}