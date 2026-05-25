import * as d3 from "d3";
import type { RectNode } from "./types";
import { applyAttr } from "./applyAttr";

export function positionTransition(
    g: d3.Transition<SVGGElement, unknown, null, undefined>,
    displayRoot: RectNode,
    x: d3.ScaleLinear<number, number>,
    y: d3.ScaleLinear<number, number>,
    width: number
) {
    applyAttr(g.selectAll<SVGGElement, RectNode>("g"), displayRoot, x, y, width);
}

