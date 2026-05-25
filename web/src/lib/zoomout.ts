import * as d3 from "d3";
import { positionTransition } from "./positionTransition";
import type { RectNode, GT } from "./types";
import type { TreemapContext } from "./treemapContext";

export function zoomout(d: RectNode, ctx: TreemapContext) {
    const { groupRef, rootRef, svg, x, y, width, currentNodeNameRef, onZoomCompleteRef, render } = ctx;

    currentNodeNameRef.current =
        d.parent && d.parent !== rootRef.current ? d.parent.data.name : null;
    const group0 = groupRef.current.attr("pointer-events", "none");
    groupRef.current = svg.insert<SVGGElement>("g", "*");
    render(groupRef.current, d.parent!);

    x.domain([d.parent!.x0, d.parent!.x1]);
    y.domain([d.parent!.y0, d.parent!.y1]);

    svg.transition()
        .duration(750)
        .call((t) => {
            const tr0 = group0.transition(t as unknown as GT).remove()
                .attrTween("opacity", () => (n) => String(d3.interpolate(1, 0)(n)));
            positionTransition(tr0, d, x, y, width);
        })
        .call((t) => {
            const tr = groupRef.current.transition(t as unknown as GT)
                .on("end", () => onZoomCompleteRef.current?.(d.parent!.data));
            positionTransition(tr, d.parent!, x, y, width);
        });
}
