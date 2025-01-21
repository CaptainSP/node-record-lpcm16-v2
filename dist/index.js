"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
("use strict");
const assert_1 = __importDefault(require("assert"));
const debug_1 = __importDefault(require("debug"));
const child_process_1 = require("child_process");
const arecord_1 = __importDefault(require("./recorders/arecord"));
const rec_1 = __importDefault(require("./recorders/rec"));
const sox_1 = __importDefault(require("./recorders/sox"));
const debug = (0, debug_1.default)("record");
class Recording {
    constructor(options = {}) {
        this._stream = null;
        const defaults = {
            sampleRate: 16000,
            channels: 1,
            compress: false,
            threshold: 0.5,
            thresholdStart: null,
            thresholdEnd: null,
            silence: "1.0",
            recorder: "sox",
            endOnSilence: false,
            audioType: "wav",
            cmd: "sox",
        };
        this.options = Object.assign(defaults, options);
        let recorder = sox_1.default;
        if (this.options.recorder === "rec") {
            recorder = rec_1.default;
        }
        else if (this.options.recorder === "arecord") {
            recorder = arecord_1.default;
        }
        const { cmd, args, spawnOptions = {} } = recorder(this.options);
        this.cmd = this.options.cmd || cmd;
        this.args = args;
        this.cmdOptions = Object.assign({ encoding: "binary", stdio: "pipe" }, spawnOptions);
        debug(`Started recording`);
        debug(this.options);
        debug(` ${this.cmd} ${this.args.join(" ")}`);
        return this.start();
    }
    start() {
        const { cmd, args, cmdOptions } = this;
        const cp = (0, child_process_1.spawn)(cmd, args, cmdOptions);
        const rec = cp.stdout;
        const err = cp.stderr;
        this.process = cp; // expose child process
        this._stream = rec; // expose output stream
        cp.on("close", (code) => {
            if (code === 0)
                return;
            rec === null || rec === void 0 ? void 0 : rec.emit("error", `${this.cmd} has exited with error code ${code}.

Enable debugging with the environment variable DEBUG=record.`);
        });
        err === null || err === void 0 ? void 0 : err.on("data", (chunk) => {
            debug(`STDERR: ${chunk}`);
        });
        rec === null || rec === void 0 ? void 0 : rec.on("data", (chunk) => {
            debug(`Recording ${chunk.length} bytes`);
        });
        rec === null || rec === void 0 ? void 0 : rec.on("end", () => {
            debug("Recording ended");
        });
        return this;
    }
    stop() {
        (0, assert_1.default)(this.process, "Recording not yet started");
        this.process.kill();
    }
    pause() {
        var _a;
        (0, assert_1.default)(this.process, "Recording not yet started");
        this.process.kill("SIGSTOP");
        (_a = this._stream) === null || _a === void 0 ? void 0 : _a.pause();
        debug("Paused recording");
    }
    resume() {
        var _a;
        (0, assert_1.default)(this.process, "Recording not yet started");
        this.process.kill("SIGCONT");
        (_a = this._stream) === null || _a === void 0 ? void 0 : _a.resume();
        debug("Resumed recording");
    }
    isPaused() {
        var _a;
        (0, assert_1.default)(this.process, "Recording not yet started");
        return ((_a = this._stream) === null || _a === void 0 ? void 0 : _a.isPaused()) || false;
    }
    stream() {
        (0, assert_1.default)(this._stream, "Recording not yet started");
        return this._stream;
    }
}
module.exports = {
    record: (...args) => new Recording(...args),
};
