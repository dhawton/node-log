import fs from "fs";
import { LogTypes } from "Log";
import path from "path";

class Log {
    static lastDate: string;
    static debugMode = false;
    static logToFile = false;
    static logPath: string;
    static logPrefix = "application";

    static write(message: string, type: LogTypes): void {
        const d = new Date();
        const today = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
        if (this.logToFile) {
            if (this.lastDate && today !== this.lastDate && fs.existsSync(path.join(this.logPath, `${this.logPrefix}.log`))) {
                fs.renameSync(path.join(this.logPath, `${this.logPrefix}.log`), path.join(this.logPath,`${this.logPrefix}-${this.lastDate}.log`));
                this.lastDate = today;
            }
        }
        
        const msg = `[${d.toISOString()}] ${type.padEnd(5, " ")} - ${message}`;
        if ((this.debugMode && type == LogTypes.DEBUG) || type !== LogTypes.DEBUG) {
            console.log(msg);
        }
        
        if (this.logToFile) {
            fs.appendFile(path.join(this.logPath, `${this.logPrefix}.log`), msg, () => {});
        }
    }

    static Info(message: string): void { Log.write(message, LogTypes.INFO); }
    static Error(message: string): void { Log.write(message, LogTypes.ERROR); }
    static Fatal(message: string): void {
        Log.write(message, LogTypes.FATAL);
        process.exit(1);
    }
    static Warn(message: string): void {
        Log.write(message, LogTypes.WARN);
    }
    static Debug(message: string): void {
        Log.write(message, LogTypes.DEBUG);
    }
}

export default Log;