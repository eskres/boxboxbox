import * as d3 from "d3";
import type { MultiLineDatum } from "../types";

export function groupSeries(
    data: MultiLineDatum[],
    seriesOrder?: string[]
): { seriesKeys: string[]; sortedGrouped: Map<string, MultiLineDatum[]> } {
    const allSeries = new Set(data.map(d => d.series));
    const seriesKeys = seriesOrder
        ? seriesOrder.filter(s => allSeries.has(s))
        : [...allSeries].sort();
    const grouped = d3.group(data, d => d.series);
    const sortedGrouped = new Map(
        seriesKeys.map(key => [key, [...(grouped.get(key) ?? [])].sort((a, b) => a.x - b.x)])
    );
    return { seriesKeys, sortedGrouped };
}
