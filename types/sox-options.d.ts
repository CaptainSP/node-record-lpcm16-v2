export type SoxOptions = {
  sampleRate: string;
  channels: string;
  audioType: string;
  endOnSilence?: boolean;
  threshold?: string;
  thresholdStart?: string;
  thresholdEnd?: string;
  silence?: string;
  device?: string;
  recorder:"sox";
}