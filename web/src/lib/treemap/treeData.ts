import type { TreeNode } from "./types";
import type { Season, Race, DriverPitStop } from "@/lib/types";

export function buildSeasonChildren(seasons: Season[]): TreeNode[] {
    return seasons.map((s) => ({
        name: String(s.year),
        value: s.totalPitTime,
        type: "season" as const,
        year: s.year,
        loaded: false,
        children: [],
    }));
}

export function graftRaces(
    tree: TreeNode,
    year: number,
    races: Race[]
): TreeNode {
    return {
        ...tree,
        children: tree.children?.map((child) =>
            child.year === year
                ? {
                    ...child,
                    loaded: true,
                    value: 0,
                    children: races.map((r) => ({
                        name: r.officialName,
                        value: r.totalPitTime,
                        type: "race" as const,
                        id: r.id,
                        loaded: false,
                        children: [],
                    })),
                }
                : child
        ),
    };
}

export function graftDrivers(
    tree: TreeNode,
    raceId: number,
    stops: DriverPitStop[]
): TreeNode {
    const update = (node: TreeNode): TreeNode => ({
        ...node,
        children: node.children?.map((child) =>
            child.id === raceId
                ? {
                    ...child,
                    loaded: true,
                    value: 0,
                    children: stops.map((s) => ({
                        name: s.driverId.replace(/-/g, " "),
                        value: s.totalPitTime,
                        type: "driver" as const,
                        constructorId: s.constructorId,
                    })),
                }
                : child.children
                    ? update(child)
                    : child
        ),
    });
    return update(tree);
}
