import type { HierarchyRectangularNode, Transition, BaseType } from "d3";

export interface TreeNode {
    name: string;
    value?: number;
    children?: TreeNode[];
    type?: "season" | "race" | "driver";
    year?: number;
    id?: number;
    loaded?: boolean;
    constructorId?: string;
}

export type RectNode = HierarchyRectangularNode<TreeNode>;
export type GT = Transition<BaseType, unknown, null, undefined>;
