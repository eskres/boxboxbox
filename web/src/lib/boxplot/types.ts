import type { MultiLineDatum } from "@/lib/multiline/types";

export type { MultiLineDatum };

export interface BoxStats {
    key: string;
    q1: number;
    q2: number;
    q3: number;
    lo: number;
    hi: number;
    outliers: number[];
}

export interface BoxPlotChartProps {
    data: MultiLineDatum[];
    seriesOrder?: string[];
    seriesColors?: Record<string, string>;
    formatY?: (v: number) => string;
    yLabel?: string;
}