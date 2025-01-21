import { Recorder } from "../types/recorder";
import { SoxOptions } from "../types/sox-options";
declare const createSoxCommand: (options: SoxOptions) => Recorder;
export default createSoxCommand;
