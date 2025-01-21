export type RecOptions = {
  sampleRate: number;
  channels: number;
  audioType: string;
  endOnSilence?: boolean;
  threshold?: string;
  thresholdStart?: string;
  thresholdEnd?: string;
  silence?: string;
  recorder:"rec";
}
