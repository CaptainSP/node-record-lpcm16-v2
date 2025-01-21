import { ArecordOptions } from "./arecord-options";
import { SoxOptions } from "./sox-options";

export type RecorderOptions =  {
  cmd?: string;
} & ArecordOptions & SoxOptions & RecOptions