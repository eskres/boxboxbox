import * as d3 from "d3";
import { positionTransition } from "./positionTransition";
import type { RectNode, GT } from "./types";
import type { TreemapContext } from "./treemapContext";

export function zoomin(d: RectNode, ctx: TreemapContext) {
    const { groupRef, svg, x, y, width, currentNodeNameRef, onZoomCompleteRef, render } = ctx;
    const parent = d.parent;

    currentNodeNameRef.current = d.data.name;
    const group0 = groupRef.current.attr("pointer-events", "none");
    groupRef.current = svg.append<SVGGElement>("g");
    render(groupRef.current, d);

    x.domain([d.x0, d.x1]);
    y.domain([d.y0, d.y1]);

    svg.transition()
        .duration(750)
        .call((t) => {
            if (!parent) return;
            positionTransition(group0.transition(t as unknown as GT).remove(), parent, x, y, width);
        })
        .call((t) => {
            const tr = groupRef.current.transition(t as unknown as GT)
                .attrTween("opacity", () => (n) => String(d3.interpolate(0, 1)(n)))
                .on("end", () => onZoomCompleteRef.current?.(d.data));
            positionTransition(tr, d, x, y, width);
        });
}
