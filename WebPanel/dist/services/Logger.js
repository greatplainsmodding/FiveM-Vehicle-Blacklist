"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
class Logger {
    static log(message) {
        const date = new Date;
        const m = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const formattedTime = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
        const formattedDate = `${m[date.getMonth()]}-${date.getDate()}-${date.getFullYear()}`;
        const formattedDateLog = `${date.getDate()}-${m[date.getMonth()]}-${date.getFullYear()}`;
        const tm = [
            `\x1b[96m${formattedDate} | ${formattedTime}:\x1b[0m`,
            `${formattedDateLog}`,
            `${formattedDate} | ${formattedTime}:`
        ];
        console.log('\x1b[92mLOG\x1b[0m', '-', tm[0], message);
        if (!fs_1.default.existsSync(`./data/logs/`))
            fs_1.default.mkdirSync(`./data/logs/`, { recursive: true });
        fs_1.default.appendFileSync(`./data/logs/${tm[1]}.log`, `${'Log - ' + tm[2] + message}\n`);
    }
    ;
}
;
exports.default = Logger.log;
