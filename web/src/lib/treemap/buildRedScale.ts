import type { TreeNode } from "./types";

export function buildRedScale(
    { value = 0 }: Partial<TreeNode>,
    min: number,
    max: number
): string {
    const t = max === min ? 0 : (value - min) / (max - min);
    const lightness = Math.round(80 - t * 40);
    const hue = t < 0.6 ? 0 : Math.round(360 - 13 * ((t - 0.6) / 0.4));
    return `hsl(${hue}, 90%, ${lightness}%)`;
}
