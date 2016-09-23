/* @flow */

import type { ServiceStatusModel } from "./ServiceStatusModel.js";

export type ServiceModel = {
    icon: string,
    name: string,
    message: string,
    status: ServiceStatusModel;
}