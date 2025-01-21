"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const createArecordCommand = (options) => {
    const cmd = 'arecord';
    const args = [
        '-q', // show no progress
        '-r', options.sampleRate.toString(), // sample rate
        '-c', options.channels.toString(), // channels
        '-t', options.audioType, // audio type
        '-f', 'S16_LE', // Sample format
        '-' // pipe
    ];
    if (options.device) {
        args.unshift('-D', options.device);
    }
    return { cmd, args };
};
exports.default = createArecordCommand;
