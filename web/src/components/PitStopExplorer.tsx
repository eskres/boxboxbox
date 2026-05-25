"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { apolloClient } from "@/lib/apollo-client";
import { RACES_BY_SEASON_QUERY, RACE_PIT_STOPS_QUERY } from "@/lib/queries";
import { ZoomableTreemap } from "@/components/ZoomableTreemap";
import { buildSeasonChildren, graftRaces, graftDrivers } from "@/lib/treeData";
import type { TreeNode, Season } from "@/lib/types";
import type { Race, DriverPitStop } from "@/lib/types";


interface Props {
    initialSeasons: Season[];
}

export function PitStopExplorer({ initialSeasons }: Props) {
    const [treeData, setTreeData] = useState<TreeNode>({
        name: "Total Time in the Pit Lane",
        children: buildSeasonChildren(initialSeasons),
    });

    const fetchingRacesRef = useRef<Set<number>>(new Set());
    const fetchingDriversRef = useRef<Set<number>>(new Set());
    const treeDataRef = useRef(treeData);
    useEffect(() => { treeDataRef.current = treeData; }, [treeData]);

    useEffect(() => {
        if (!initialSeasons.length) return;

        initialSeasons.forEach(async (season) => {
            if (fetchingRacesRef.current.has(season.year)) return;
            fetchingRacesRef.current.add(season.year);

            try {
                const result = await apolloClient.query<{ racesBySeason: Race[] }>({
                    query: RACES_BY_SEASON_QUERY,
                    variables: { year: season.year },
                });
                const races = result.data?.racesBySeason ?? [];
                setTreeData((prev) => graftRaces(prev, season.year, races));
            } catch (e) {
                fetchingRacesRef.current.delete(season.year);
            }
        });
    }, [initialSeasons]);

    const onZoomComplete = useCallback(
        (node: TreeNode) => {
            if (node?.type !== "season") return;

            const season = treeDataRef.current.children?.find(
                (s) => s?.year === node?.year
            );

            const races = season?.children ?? [];

            races.forEach(async (race) => {
                const raceId = race.id;
                if (!raceId) return;
                if (race?.loaded) return;
                if (fetchingDriversRef.current.has(raceId)) return;
                fetchingDriversRef.current.add(raceId);

                try {
                    const result = await apolloClient.query<{ racePitStops: DriverPitStop[] }>({
                        query: RACE_PIT_STOPS_QUERY,
                        variables: { raceId },
                    });
                    const stops = result.data?.racePitStops ?? [];
                    setTreeData((prev) => graftDrivers(prev, raceId, stops));
                } catch (e) {
                    fetchingDriversRef.current.delete(raceId);
                }
            });
        },
        []
    );

    return (
        <>
            <div className="mb-6">
                <h1 className="text-3xl font-bold tracking-tight mb-6">
                    BoxBoxBox - F1 Data Visualiser
                </h1>
                <h2 className="text-2xl font-bold">Time Spent in the Pit Lane per Race</h2>
                <p className="text-sm text-gray-500 mt-1">
                    Click a season to explore races · Click a race to see drivers ·
                    Click the header to zoom out
                </p>
            </div>
            <ZoomableTreemap
                data={treeData}
                onZoomComplete={onZoomComplete}
            />
        </>
    );
}
