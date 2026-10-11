import * as d3 from "d3";
import { positionTransition } from "./positionTransition";
import type { RectNode, GT } from "./types";
import type { TreemapContext } from "./treemapContext";

export function zoomout(d: RectNode, ctx: TreemapContext) {
    const { groupRef, rootRef, svg, x, y, width, currentNodeNameRef, onZoomCompleteRef, render } = ctx;
    const parent = d.parent;
    if (!parent) return;

    currentNodeNameRef.current = parent !== rootRef.current ? parent.data.name : null;
    const group0 = groupRef.current.attr("pointer-events", "none");
    groupRef.current = svg.insert<SVGGElement>("g", "*");
    render(groupRef.current, parent);

    x.domain([parent.x0, parent.x1]);
    y.domain([parent.y0, parent.y1]);

    svg.transition()
        .duration(750)
        .call((t) => {
            const tr0 = group0.transition(t as unknown as GT).remove()
                .attrTween("opacity", () => (n) => String(d3.interpolate(1, 0)(n)));
            positionTransition(tr0, d, x, y, width);
        })
        .call((t) => {
            const tr = groupRef.current.transition(t as unknown as GT)
                .on("end", () => onZoomCompleteRef.current?.(parent.data));
            positionTransition(tr, parent, x, y, width);
        });
}
