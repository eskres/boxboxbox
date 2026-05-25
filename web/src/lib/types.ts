import type { HierarchyRectangularNode, Transition, BaseType } from "d3";

export type RectNode = HierarchyRectangularNode<TreeNode>;
export type GT = Transition<BaseType, unknown, null, undefined>;

export interface Season {
    year: number;
    totalPitTime: number;
}

export interface Race {
    id: number;
    officialName: string;
    round: number;
    totalPitTime: number;
}

export interface DriverPitStop {
    driverId: string;
    constructorId: string;
    totalPitTime: number;
    stopCount: number;
}

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