from strawberry.dataloader import DataLoader
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text
from fastapi_cache import FastAPICache
from app.cache import WEEK_TTL, MONTH_TTL
import json

async def get_current_season(session: AsyncSession) -> int:
    result = await session.execute(
        text("SELECT MAX(year) FROM race WHERE date <= CURRENT_DATE")
    )
    return result.scalar()

async def load_races(keys: list[int], session: AsyncSession) -> list[list[dict]]:
    current_season = await get_current_season(session)

    cached = {}
    missing = []
    for year in keys:
        cache_key = f"races:{year}"
        value = await FastAPICache.get_backend().get(cache_key)
        if value:
            cached[year] = json.loads(value)
        else:
            missing.append(year)

    if missing:
        result = await session.execute(
            text("""
                SELECT r.id, r.round, r.year,
                       CASE
                           WHEN REPLACE(r.grand_prix_id, '-', ' ') = REPLACE(r.circuit_id, '-', ' ')
                           THEN REPLACE(r.grand_prix_id, '-', ' ')
                           ELSE REPLACE(r.grand_prix_id, '-', ' ') || ': ' || r.circuit_id
                       END AS official_name,
                       SUM(ps.time_millis) AS total_pit_time
                FROM pit_stop ps
                JOIN race r ON ps.race_id = r.id
                WHERE ps.time_millis < 120000
                AND r.year = ANY(:years)
                GROUP BY r.id, r.grand_prix_id, r.circuit_id, r.round, r.year
                ORDER BY r.year, r.round
            """),
            {"years": missing}
        )
        rows = result.mappings().all()

        by_year: dict[int, list] = {y: [] for y in missing}
        for row in rows:
            by_year[row["year"]].append(dict(row))

        for year, races in by_year.items():
            ttl = WEEK_TTL if year == current_season else MONTH_TTL
            await FastAPICache.get_backend().set(
                f"races:{year}",
                json.dumps(races),
                expire=ttl
            )
            cached[year] = races

    return [cached.get(year, []) for year in keys]


async def load_pit_stops(keys: list[int], session: AsyncSession) -> list[list[dict]]:
    cached = {}
    missing = []
    for race_id in keys:
        value = await FastAPICache.get_backend().get(f"pit_stops:{race_id}")
        if value:
            cached[race_id] = json.loads(value)
        else:
            missing.append(race_id)

    if missing:
        result = await session.execute(
            text("""
                SELECT driver_id, constructor_id,
                       SUM(time_millis) AS total_pit_time,
                       COUNT(*) AS stop_count,
                       race_id
                FROM pit_stop
                WHERE race_id = ANY(:race_ids)
                AND time_millis < 120000
                GROUP BY race_id, driver_id, constructor_id
                ORDER BY total_pit_time DESC
            """),
            {"race_ids": missing}
        )
        rows = result.mappings().all()

        by_race: dict[int, list] = {r: [] for r in missing}
        for row in rows:
            by_race[row["race_id"]].append(dict(row))

        for race_id, stops in by_race.items():
            await FastAPICache.get_backend().set(
                f"pit_stops:{race_id}",
                json.dumps(stops),
                expire=MONTH_TTL
            )
            cached[race_id] = stops

    return [cached.get(race_id, []) for race_id in keys]


def create_dataloaders(session: AsyncSession) -> dict:
    return {
        "races": DataLoader(
            load_fn=lambda keys: load_races(keys, session)
        ),
        "pit_stops": DataLoader(
            load_fn=lambda keys: load_pit_stops(keys, session)
        ),
    }