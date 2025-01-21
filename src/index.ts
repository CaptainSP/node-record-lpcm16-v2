import { Recorder } from "./../types/recorder.d";
import { RecorderOptions } from "./../types/recording-options.d";
("use strict");

import assert from "assert";
import debugs from "debug";
import { ChildProcess, spawn, SpawnOptions } from "child_process";
import { Readable } from "stream";

import arecord from "./recorders/arecord";
import rec from "./recorders/rec";
import sox from "./recorders/sox";

const debug = debugs("record");

class Recording {
  private options: RecorderOptions;
  private cmd: string;
  private args: string[];
  private cmdOptions: SpawnOptions;
  private process?: ChildProcess;
  private _stream: Readable | null = null;

  constructor(options: RecorderOptions = {}) {
    const defaults: RecorderOptions = {
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

    let recorder: (options: RecorderOptions) => Recorder = sox;

    if (this.options.recorder === "rec") {
      recorder = rec;
    } else if (this.options.recorder === "arecord") {
      recorder = arecord;
    }

    const { cmd, args, spawnOptions = {} }: Recorder = recorder(this.options);

    this.cmd = this.options.cmd || cmd;
    this.args = args;
    this.cmdOptions = Object.assign(
      { encoding: "binary", stdio: "pipe" },
      spawnOptions
    );

    debug(`Started recording`);
    debug(this.options);
    debug(` ${this.cmd} ${this.args.join(" ")}`);

    return this.start();
  }

  start(): this {
    const { cmd, args, cmdOptions } = this;

    const cp = spawn(cmd, args, cmdOptions);
    const rec = cp.stdout;
    const err = cp.stderr;

    this.process = cp; // expose child process
    this._stream = rec; // expose output stream

    cp.on("close", (code) => {
      if (code === 0) return;
      rec?.emit(
        "error",
        `${this.cmd} has exited with error code ${code}.

Enable debugging with the environment variable DEBUG=record.`
      );
    });

    err?.on("data", (chunk) => {
      debug(`STDERR: ${chunk}`);
    });

    rec?.on("data", (chunk) => {
      debug(`Recording ${chunk.length} bytes`);
    });

    rec?.on("end", () => {
      debug("Recording ended");
    });

    return this;
  }

  stop(): void {
    assert(this.process, "Recording not yet started");

    this.process.kill();
  }

  pause(): void {
    assert(this.process, "Recording not yet started");

    this.process.kill("SIGSTOP");
    this._stream?.pause();
    debug("Paused recording");
  }

  resume(): void {
    assert(this.process, "Recording not yet started");

    this.process.kill("SIGCONT");
    this._stream?.resume();
    debug("Resumed recording");
  }

  isPaused(): boolean {
    assert(this.process, "Recording not yet started");

    return this._stream?.isPaused() || false;
  }

  stream(): Readable {
    assert(this._stream, "Recording not yet started");

    return this._stream;
  }
}

module.exports = {
  record: (...args: any[]) => new Recording(...args),
};
