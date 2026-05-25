import { gql } from "@apollo/client";

export const SEASONS_QUERY = gql`
  query GetSeasons {
    seasons {
      year
      totalPitTime
    }
  }
`;

export const RACES_BY_SEASON_QUERY = gql`
  query GetRacesBySeason($year: Int!) {
    racesBySeason(year: $year) {
      id
      officialName
      round
      year
      totalPitTime
    }
  }
`;

export const RACE_PIT_STOPS_QUERY = gql`
  query GetRacePitStops($raceId: Int!) {
    racePitStops(raceId: $raceId) {
      driverId
      constructorId
      totalPitTime
      stopCount
    }
  }
`;
