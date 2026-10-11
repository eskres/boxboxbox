export interface MultiLineDatum {
    x: number;
    y: number;
    series: string;
}

export interface MultiLineChartProps {
    data: MultiLineDatum[];
    seriesOrder?: string[];
    seriesColors?: Record<string, string>;
    xLabel?: string;
    yLabel?: string;
    formatX?: (v: number) => string;
    formatY?: (v: number) => string;
    scPeriods?: [number, number][];
    vscPeriods?: [number, number][];
}

export interface RaceSession {
    session_key: number;
    year: number;
    location: string;
    country_name: string;
    date_start: string;
    meeting_name?: string;
}

export interface RaceLapsResponse {
    laps: MultiLineDatum[];
    driverOrder: string[];
    driverColors: Record<string, string>;
    scPeriods?: [number, number][];
    vscPeriods?: [number, number][];
}

export interface ChartDimensions {
    W: number;
    H: number;
    mt: number;
    mb: number;
    ml: number;
    mr: number;
    itemsPerRow: number;
    itemW: number;
}
