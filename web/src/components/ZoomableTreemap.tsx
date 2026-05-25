"use client";

import { useEffect, useRef } from "react";
import * as d3 from "d3";
import { buildRedScale } from "@/lib/buildRedScale";
import { positionSelection } from "@/lib/positionSelection";
import { zoomin } from "@/lib/zoomin";
import { zoomout } from "@/lib/zoomout";
import { redraw } from "@/lib/redraw";
import { buildRoot } from "@/lib/buildRoot";
import { uid } from "@/lib/uid";
import type { TreeNode, RectNode } from "@/lib/types";
import type { TreemapContext } from "@/lib/treemapContext";

interface Props {
    data: TreeNode;
    onZoomComplete?: (node: TreeNode) => void;
}

export function ZoomableTreemap({ data, onZoomComplete }: Props) {
    const containerRef = useRef<HTMLDivElement>(null);
    const svgRef = useRef<SVGSVGElement>(null);
    const onZoomCompleteRef = useRef(onZoomComplete);
    const dataRef = useRef(data);
    const currentNodeNameRef = useRef<string | null>(null);
    const redrawRef = useRef<(() => void) | null>(null);

    useEffect(() => {
        onZoomCompleteRef.current = onZoomComplete;
    }, [onZoomComplete]);

    useEffect(() => {
        dataRef.current = data;
        redrawRef.current?.();
    }, [data]);

    useEffect(() => {
        if (!svgRef.current || !containerRef.current) return;
        if (!dataRef.current.children?.length) return;

        const width = containerRef.current.clientWidth;
        const height = Math.min(Math.max(width * 0.8, 500), 750);

        const svg = d3.select(svgRef.current)
            .attr("viewBox", `0.5 -40.5 ${width} ${height + 40}`)
            .attr("width", width)
            .attr("height", height + 40)
            .style("font", "13px Jost, sans-serif");

        svg.selectAll("*").remove();

        const x = d3.scaleLinear().rangeRound([0, width]);
        const y = d3.scaleLinear().rangeRound([0, height]);

        const leafUids = new WeakMap<RectNode, { id: string; href: string }>();
        const clipUids = new WeakMap<RectNode, { id: string; href: string }>();
        const format = (ms: number) =>
            ms >= 60000
                ? `${d3.format(",.1f")(ms / 60000)} mins`
                : `${d3.format(",.2f")(ms / 1000)} secs`;
        const getName = (d: d3.HierarchyNode<TreeNode>) =>
            d.ancestors().reverse().map((d) => d.data.name).join(" / ");

        let ctx: TreemapContext;

        function render(
            group: d3.Selection<SVGGElement, unknown, any, any>,
            displayRoot: RectNode
        ) {
            const visibleNodes = displayRoot.children ?? [];
            const values = visibleNodes.map((d) => d.value ?? 0);
            const minVal = Math.min(...values);
            const maxVal = Math.max(...values);

            const node = group
                .selectAll<SVGGElement, RectNode>("g")
                .data([...(displayRoot.children ?? []), displayRoot])
                .join("g");

            node
                .filter((d) => (d === displayRoot ? !!d.parent : !!d.children))
                .attr("cursor", "pointer")
                .on("click", (_, d) =>
                    d === displayRoot ? zoomout(displayRoot, ctx) : zoomin(d, ctx)
                );

            node.append("title")
                .text((d) => `${getName(d)}\n${format(d.value ?? 0)}`);

            node.append("rect")
                .attr("id", (d) => {
                    const lu = uid("leaf");
                    leafUids.set(d, lu);
                    return lu.id;
                })
                .attr("fill", (d) => {
                    if (d === displayRoot) return "#9f1239";
                    return buildRedScale({ value: d.value }, minVal, maxVal);
                })
                .attr("stroke", "#fff");

            node.append("clipPath")
                .attr("id", (d) => {
                    const cu = uid("clip");
                    clipUids.set(d, cu);
                    return cu.id;
                })
                .append("use")
                .attr("href", (d) => leafUids.get(d)?.href ?? "");

            node.append("text")
                .attr("clip-path", (d) => `url(${clipUids.get(d)?.href ?? ""})`)
                .attr("fill", "white")
                .attr("font-weight", (d) => (d === displayRoot ? "bold" : null))
                .selectAll("tspan")
                .data((d) => {
                    const label = d === displayRoot ? getName(d) : d.data.name;
                    return [label, format(d.value ?? 0)];
                })
                .join("tspan")
                .style("text-transform", (_, i) => i === 0 ? "capitalize" : "none")
                .attr("x", 3)
                .attr("y", (_, i, nodes) =>
                    `${(i === nodes.length - 1 ? 0.3 : 0) + 1.1 + i * 0.9}em`
                )
                .attr("fill-opacity", (_, i, nodes) =>
                    i === nodes.length - 1 ? 0.7 : null
                )
                .attr("font-weight", (_, i, nodes) =>
                    i === nodes.length - 1 ? "normal" : null
                )
                .text((d) => d);

            positionSelection(group, displayRoot, x, y, width);
        }

        const groupRef = { current: svg.append<SVGGElement>("g") };
        const rootRef = { current: buildRoot(dataRef.current, width, height) };

        ctx = {
            svg, x, y, width, height,
            groupRef, rootRef,
            currentNodeNameRef, onZoomCompleteRef,
            render, dataRef,
        };

        redrawRef.current = () => redraw(ctx);
        render(groupRef.current, rootRef.current);
    }, []);

    return (
        <div ref={containerRef} className="w-full">
            <svg ref={svgRef} className="w-full" />
        </div>
    );
}
