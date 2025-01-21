export type ArecordOptions = {
  recorder: "arecord";
  sampleRate: number;
  channels: number;
  audioType: string;
  device?: string;
}
