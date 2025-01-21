import { RecorderOptions } from "./types/recording-options";
import { Readable } from "stream";
declare class Recording {
    private options;
    private cmd;
    private args;
    private cmdOptions;
    private process?;
    private _stream;
    constructor(options?: RecorderOptions);
    start(): this;
    stop(): void;
    pause(): void;
    resume(): void;
    isPaused(): boolean;
    stream(): Readable;
}
export default Recording;
