import { PitStopExplorer } from "@/components/PitStopExplorer";
import { fetchGraphQL } from "@/lib/graphql";
import { SEASONS_QUERY } from "@/lib/queries";
import type { Season } from "@/lib/types";

export default async function Page() {
    const data = await fetchGraphQL<{ seasons: Season[] }>(SEASONS_QUERY);

    return (
        <main>
            <PitStopExplorer initialSeasons={data.seasons} />
        </main>
    );
}