import type { Selection, ScaleLinear } from "d3";
import type { RectNode, TreeNode } from "./types";

export interface TreemapContext {
    svg: Selection<SVGSVGElement, unknown, null, undefined>;
    x: ScaleLinear<number, number>;
    y: ScaleLinear<number, number>;
    width: number;
    height: number;
    groupRef: { current: Selection<SVGGElement, unknown, any, any> };
    rootRef: { current: RectNode };
    currentNodeNameRef: { current: string | null };
    onZoomCompleteRef: { current: ((node: TreeNode) => void) | undefined };
    render: (group: Selection<SVGGElement, unknown, any, any>, displayRoot: RectNode) => void;
    dataRef: { current: TreeNode };
}
