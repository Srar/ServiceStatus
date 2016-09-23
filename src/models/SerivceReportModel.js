/* @flow */

export default class SerivceReportModel {
    status: bool;
    message: { [key: string]: string }

    constructor(status: bool) {
        this.status  = status;
        this.message = {};
    }

    getStatus(): boolean {
        return this.status;
    }

    getAllMessages(): { [key: string]: string } {
        return this.message;
    }

    getMessage(key: string): string {
        return this.message[key];
    }

    setMessage(key: string, message: string) {
        this.message[key] = message;
    }

}