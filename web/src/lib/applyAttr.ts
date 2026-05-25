import * as d3 from "d3";
import type { RectNode } from "./types";

interface Positionable {
    select(selector: string): Positionable;
    attr(name: string, value: (d: any) => string | number | null): Positionable;
}

export function applyAttr(
    nodes: Positionable,
    displayRoot: RectNode,
    x: d3.ScaleLinear<number, number>,
    y: d3.ScaleLinear<number, number>,
    width: number
) {
    nodes
        .attr("transform", (d: RectNode) =>
            d === displayRoot ? "translate(0,-40)" : `translate(${x(d.x0)},${y(d.y0)})`
        )
        .select("rect")
        .attr("width", (d: RectNode) => (d === displayRoot ? width : x(d.x1) - x(d.x0)))
        .attr("height", (d: RectNode) => (d === displayRoot ? 40 : y(d.y1) - y(d.y0)));
}
