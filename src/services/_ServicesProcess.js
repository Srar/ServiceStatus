/* @flow */

import fs from "fs";
import path from "path";
import events from "events";

import type { ServiceTaskModel } from "../models/ServiceTaskModel.js";
import type { ServiceStatusModel } from "../models/ServiceStatusModel.js";
import type { ServiceModel } from "../models/ServiceModel.js";
import SerivceReportModel from "../models/SerivceReportModel.js";

import { IService } from "./_IService.js";
import Services from "./_Services.js";

var eventEmitter: events = new events.EventEmitter();
eventEmitter.setMaxListeners(100);
var Tasks: { [name: string]: ServiceTaskModel } = {};

export default class ServicesProcess {

    static getEventEmitter(): events {
        return eventEmitter;
    }

    static loadTargets() {
        var files: Array<string> = fs.readdirSync(path.join("targets"));
        files.forEach(file => {
            var targetSource: string = fs.readFileSync(path.join("targets", file)).toString();
            var targetJson: JSON = JSON.parse(targetSource);
            ServicesProcess.loadProcess(targetJson);
        });
    }

    static loadProcess(targetConfig: any) {
        if (targetConfig["Name"] == undefined) {
            throw `load service target config error: [Name] undefined.`;
        }

        if (targetConfig["Service"] == undefined) {
            throw `load service target config error: [${targetConfig["Name"]}][Service] undefined.`;
        }

        if (targetConfig["Target"] == undefined) {
            throw `load service target config error: [${targetConfig["Name"]}][Target] undefined.`;
        }

        if (targetConfig["WarningLimit"] == undefined) {
            throw `load service target config error: [${targetConfig["Name"]}][WarningLimit] undefined.`;
        }

        if (targetConfig["ErrorLimit"] == undefined) {
            throw `load service target config error: [${targetConfig["Name"]}][ErrorLimit] undefined.`;
        }

        if (targetConfig["CheckTimer"] == undefined) {
            throw `load service target config error: [${targetConfig["Name"]}][CheckTimer] undefined.`;
        }

        if (isNaN(parseInt(targetConfig["WarningLimit"]))) {
            throw `load service target config error: [${targetConfig["Name"]}][WarningLimit] type must be number.`
        }

        if (isNaN(parseInt(targetConfig["ErrorLimit"]))) {
            throw `load service target config error: [${targetConfig["Name"]}][ErrorLimit] type must be number.`
        }

        if (isNaN(parseInt(targetConfig["CheckTimer"]))) {
            throw `load service target config error: [${targetConfig["Name"]}][CheckTimer] type must be number.`
        }

        if (!Services.serviceIsExists(targetConfig["Service"])) {
            throw `can't load service [${targetConfig["Name"]}][${targetConfig["Service"]}] module.`
        }

        var task: ServiceTaskModel = {
            Name: targetConfig["Name"],
            Service: Services.getServiceByServiceName(targetConfig["Service"]),
            Target: targetConfig["Target"],
            NormalMessage: targetConfig["NormalMessage"] || "",
            WarningMessage: targetConfig["WarningMessage"] || "",
            ErrorMessage: targetConfig["ErrorMessage"] || "",
            WarningLimit: parseInt(targetConfig["WarningLimit"]),
            ErrorLimit: parseInt(targetConfig["ErrorLimit"]),
            CheckTimer: parseInt(targetConfig["CheckTimer"]),
            ErrorCount: 0,
            Process: () => {},
            Summary: {
                icon: targetConfig["Icon"] || "",
                message: "initializing",
                name: targetConfig["Name"],
                status: "Normal"
            },
            OtherSettings: targetConfig["OtherSettings"] || {} 
        }

        if (task.ErrorLimit < task.WarningLimit) {
            throw `load service target config error: [${targetConfig["Name"]}][ErrorLimit] must be greater than [WarningLimit].`
        }

        if (Tasks[task.Name] != undefined) {
            throw `can't load service [${targetConfig["Name"]}]: task exists.`
        }

        if (task.CheckTimer < 1) {
            throw `load service target config error: [${targetConfig["Name"]}][CheckTimer] must be greater than one.`
        }

        if(task.CheckTimer < task.Service.getCheckTimerLimit()) {
            throw `can't load service [${targetConfig["Name"]}]: check time limit ${task.Service.getCheckTimerLimit()}s.`
        }

        Tasks[task.Name] = task;

        task.Process = async function () {
            var report: SerivceReportModel;
            try {
                report = await task.Service.reportStatus(task);
            } catch (ex) {
                return console.log(`[${task.Name}] process error: ${ex.toString()}`);
            }

            if (!report.status) {
                if(!((task.ErrorCount + 10) >= task.ErrorLimit)) {
                    task.ErrorCount++;
                }
                if(report.getAllMessages()["error"]) {
                    console.error(`[${task.Name}] report ${report.getAllMessages()["error"]}.`);
                } else {
                    console.error(`[${task.Name}] report unknown error.`)
                }
            }

            if (report.status) {
                if (task.ErrorCount > 0) task.ErrorCount--;
                if (task.ErrorCount < 0) task.ErrorCount = 0;
            }

            if(task.ErrorCount < task.WarningLimit && task.Summary.status != "Normal") {
                task.Summary.status = "Normal";
                eventEmitter.emit("normal", task);
            }

            if (task.ErrorCount >= task.WarningLimit && task.Summary.status != "Warning" && task.ErrorCount < task.ErrorLimit ) {
                task.Summary.status = "Warning";
                eventEmitter.emit("warning", task);
            }

            if (task.ErrorCount >= task.ErrorLimit && task.Summary.status != "Error") {
                task.Summary.status = "Error";
                eventEmitter.emit("err", task);
            }

            if (task.Summary.status == "Normal" && report.status) {
                task.Summary.message = ServicesProcess._formatMessage(task.NormalMessage, report.getAllMessages());
            }

            if (task.Summary.status == "Warning") {
                task.Summary.message = ServicesProcess._formatMessage(task.WarningMessage, report.getAllMessages());
            }

            if (task.Summary.status == "Error") {
                task.Summary.message = ServicesProcess._formatMessage(task.ErrorMessage, report.getAllMessages());
            }
        };

        task.Process();

        setInterval(task.Process, task.CheckTimer * 1000);

        eventEmitter.emit("load", task);

        console.log(`registered service task [${task.Name}].`);
    }

    static getAllTasks(): { [name: string]: ServiceTaskModel } {
        return Tasks;
    }

    static getAllTasksSerivceModels(): Array<ServiceModel> {
        return Object.keys(Tasks).map(key => {
            return Tasks[key].Summary;
        });
    }

    static _formatMessage(message: string, messages: { [key: string]: string }): string {
        Object.keys(messages).map(key => {
            var messageKey = new RegExp(`{${key}}`, 'g');
            message = message.replace(messageKey, messages[key]);
        });
        return message;
    }
}