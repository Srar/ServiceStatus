/* @flow */

import fs from "fs";
import events from "events";
import superagent from "superagent";

import type { ServiceTaskModel } from "../models/ServiceTaskModel.js";

export default class ServicesWebHook {
    eventEmitter: events;

    constructor(eventEmitter: events) {
        this.eventEmitter = eventEmitter;
        this.eventEmitter.on("normal", this.onNormal.bind(this));
        this.eventEmitter.on("warning", this.onWarning.bind(this));
        this.eventEmitter.on("err", this.onError.bind(this));
    }

    onNormal(taskModel: ServiceTaskModel) {

    }

    onWarning(taskModel: ServiceTaskModel) {

    }

    onError(taskModel: ServiceTaskModel) {
        if (this.disabled) {
            return;
        }

        if (taskModel.OtherSettings["WebHook"] == undefined) {
            return;
        }

        var method: string = taskModel.OtherSettings["WebHook"]["method"] || "GET";
        method = method.toLowerCase();
        var url = taskModel.OtherSettings["WebHook"]["url"] || "";
        var data = taskModel.OtherSettings["WebHook"]["data"] || {};

        superagent[method](url).timeout(1000 * 5).send(data).end((err, res) => {
            if (err) {
                console.error(`[webhook] error: ${err.toString()}`);
                return;
            }
            console.log(`[webhook] Service [${taskModel.Name}] status has been sent to [${url}]`);
        });
    }

}