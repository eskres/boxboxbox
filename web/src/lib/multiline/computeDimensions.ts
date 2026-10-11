import type { ChartDimensions } from "./types";

const ITEM_W = 75;
const MIN_PX_PER_X = 16;

export function computeChartDimensions(
    containerWidth: number,
    xExtent: [number, number],
    seriesCount: number
): ChartDimensions {
    const mr = 20, mb = 44, ml = 65;
    const W = Math.max(containerWidth, (xExtent[1] - xExtent[0] + 1) * MIN_PX_PER_X + ml + mr);
    const itemsPerRow = Math.max(1, Math.floor((W - ml - mr) / ITEM_W));
    const legendRows = Math.ceil(seriesCount / itemsPerRow);
    const legendH = legendRows * 18 + 8;
    const mt = legendH + 16;
    const H = Math.max(420, Math.min(containerWidth * 0.55, 540)) + mt;
    return { W, H, mt, mb, ml, mr, itemsPerRow, itemW: ITEM_W };
}
