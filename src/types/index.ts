export interface InterestData {
  period: string;
  "25th Percentile": number;
  Median: number;
  "75th Percentile": number;
  respondents: number;
}

export interface RawDataPoint {
  quarter: string;
  [metric: string]: number | null | string;
}

export type MetricColors = Record<string, string>;
