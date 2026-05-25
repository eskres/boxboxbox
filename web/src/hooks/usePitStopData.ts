import { useQuery, useLazyQuery } from "@apollo/client/react";
import { SEASONS_QUERY, RACES_BY_SEASON_QUERY, RACE_PIT_STOPS_QUERY } from "@/lib/queries";
import type { Season, Race, DriverPitStop } from "@/lib/types";


export function useSeasons() {
    return useQuery<{ seasons: Season[] }>(SEASONS_QUERY);
}

export function useRacesBySeason() {
    return useLazyQuery<{ racesBySeason: Race[] }, { year: number }>(
        RACES_BY_SEASON_QUERY
    );
}

export function useRacePitStops() {
    return useLazyQuery<{ racePitStops: DriverPitStop[] }, { raceId: number }>(
        RACE_PIT_STOPS_QUERY
    );
}
