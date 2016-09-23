/* @flow */

import { IService } from "./_IService.js";

import HttpGet from "./HttpGet.js";
import HttpProxy from "./HttpProxy.js";
import TcpConnect from "./TcpConnect.js";

var services: { [name: string]: IService } = {};

function registerService(service: IService) {
    var serviceName = service.constructor.name;
    if(services[serviceName] != undefined) {
        return;
    }
    services[serviceName] = service;
    console.log(`registered [${serviceName}] service`);
} 

export default class Services {

    static loadServices() {
        registerService((new HttpGet   : IService));
        registerService((new HttpProxy : IService));
        registerService((new TcpConnect: IService));
    }

    static getAllServicesName(): string[] {
        return Object.keys(services);
    }

    static getServiceByServiceName(serviceName: string): IService {
        return services[serviceName];
    }

    static serviceIsExists(serviceName: string): boolean {
        return !(Services.getServiceByServiceName(serviceName) == undefined);
    }

}