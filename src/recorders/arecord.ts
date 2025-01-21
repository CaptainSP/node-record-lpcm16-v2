import { Recorder } from '../types/recorder';
import { ArecordOptions } from '../types/arecord-options';


const createArecordCommand = (options: ArecordOptions): Recorder => {
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
}

export default createArecordCommand;