import * as d3 from "d3";

export function highlightSeries(
    svg: d3.Selection<SVGSVGElement, unknown, null, undefined>,
    key: string
): void {
    svg.selectAll<Element, string>(".series-line")
        .attr("opacity", d => d === key ? 1 : 0.15);
    svg.selectAll<SVGPathElement, string>("path.series-line")
        .attr("stroke-width", d => d === key ? 2 : 1);
    svg.selectAll<SVGGElement, string>(".series-legend")
        .attr("opacity", d => d === key ? 1 : 0.3);
}

export function restoreSeries(
    svg: d3.Selection<SVGSVGElement, unknown, null, undefined>
): void {
    svg.selectAll<Element, string>(".series-line").attr("opacity", 1);
    svg.selectAll<SVGPathElement, string>("path.series-line").attr("stroke-width", 1);
    svg.selectAll<SVGGElement, string>(".series-legend").attr("opacity", 1);
}
