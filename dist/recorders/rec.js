"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const createRecCommand = (options) => {
    const cmd = "rec";
    let args = [
        "-q", // show no progress
        "-r",
        options.sampleRate.toString(), // sample rate
        "-c",
        options.channels.toString(), // channels
        "-e",
        "signed-integer", // sample encoding
        "-b",
        "16", // precision (bits)
        "-t",
        options.audioType, // audio type
        "-", // pipe
    ];
    if (options.endOnSilence) {
        args = args.concat([
            "silence",
            "1",
            "0.1",
            options.thresholdStart || options.threshold + "%",
            "1",
            options.silence,
            options.thresholdEnd || options.threshold + "%",
        ]);
    }
    return { cmd, args };
};
exports.default = createRecCommand;
