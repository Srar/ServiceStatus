/* @flow */

import { IService } from "../services/_IService.js";
import type { ServiceModel } from "./ServiceModel.js";

export type ServiceTaskModel = {
    Name: string,
    Service: IService,
    Target: any,
    NormalMessage: string,
    WarningMessage: string,
    ErrorMessage: string,
    WarningLimit: number,
    ErrorLimit: number,
    CheckTimer: number,
    ErrorCount: number,
    Summary: ServiceModel
}