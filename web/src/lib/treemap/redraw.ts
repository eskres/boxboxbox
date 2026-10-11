import { buildRoot } from "./buildRoot";
import type { RectNode } from "./types";
import type { TreemapContext } from "./treemapContext";

export function redraw(ctx: TreemapContext) {
    const { groupRef, rootRef, dataRef, currentNodeNameRef, x, y, width, height, render } = ctx;

    rootRef.current = buildRoot(dataRef.current, width, height);

    const currentName = currentNodeNameRef.current;
    const targetNode = currentName
        ? (rootRef.current.descendants().find(
            (d) => d.data.name === currentName
        ) as RectNode | undefined)
        : undefined;

    const displayNode = targetNode ?? rootRef.current;

    x.domain([displayNode.x0, displayNode.x1]);
    y.domain([displayNode.y0, displayNode.y1]);

    groupRef.current.selectAll("*").remove();
    render(groupRef.current, displayNode);
}
