import * as d3 from "d3";
import type { RectNode } from "./types";

export function tile(
    node: RectNode,
    x0: number, y0: number,
    x1: number, y1: number,
    width: number, height: number
) {
    d3.treemapBinary(node, 0, 0, width, height);
    for (const child of node.children ?? []) {
        const c = child as RectNode;
        c.x0 = x0 + (c.x0 / width) * (x1 - x0);
        c.x1 = x0 + (c.x1 / width) * (x1 - x0);
        c.y0 = y0 + (c.y0 / height) * (y1 - y0);
        c.y1 = y0 + (c.y1 / height) * (y1 - y0);
    }
}
