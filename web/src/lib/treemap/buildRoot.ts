import * as d3 from "d3";
import { tile } from "./tile";
import type { RectNode, TreeNode } from "./types";

export function buildRoot(treeData: TreeNode, width: number, height: number): RectNode {
    return d3.treemap<TreeNode>().tile((node, x0, y0, x1, y1) =>
        tile(node as RectNode, x0, y0, x1, y1, width, height)
    )(
        d3.hierarchy(treeData)
            .sum((d) => d.value ?? 0)
            .sort((a, b) => (a.value ?? 0) - (b.value ?? 0))
    ) as RectNode;
}
