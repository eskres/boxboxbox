import strawberry
from strawberry.fastapi import GraphQLRouter
from strawberry.schema.config import StrawberryConfig
from sqlalchemy import select, func, text
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import Depends
from typing import List

from app.database import get_session, get_context
from app.models import Driver, PitStop, Race
from app.schema import DriverType, PitStopType, DriverPitStopType, SeasonRaceType, SeasonType

@strawberry.type
class Query:

    @strawberry.field
    async def drivers(self, info: strawberry.types.Info) -> List[DriverType]:
        session = info.context["session"]
        result = await session.execute(select(Driver))
        drivers = result.scalars().all()
        return [
            DriverType(
                id=d.id,
                name=d.name,
                abbreviation=d.abbreviation,
                nationality_country_id=d.nationality_country_id
            )
            for d in drivers
        ]

    @strawberry.field
    async def pit_stops(
        self,
        info: strawberry.types.Info,
        race_id: int
    ) -> List[PitStopType]:
        session = info.context["session"]
        result = await session.execute(
            select(PitStop).where(PitStop.race_id == race_id)
        )
        stops = result.scalars().all()
        return [
            PitStopType(
                race_id=s.race_id,
                driver_id=s.driver_id,
                stop=s.stop,
                lap=s.lap,
                time=s.time,
                time_millis=s.time_millis,
                constructor_id=s.constructor_id
            )
            for s in stops
        ]

    @strawberry.field
    async def seasons(self, info: strawberry.types.Info) -> List[SeasonType]:
        session = info.context["session"]
        result = await session.execute(
            text("""
                SELECT r.year, SUM(ps.time_millis) AS total_pit_time
                FROM pit_stop ps
                JOIN race r ON ps.race_id = r.id
                WHERE ps.time_millis < 120000
                GROUP BY r.year
                ORDER BY r.year DESC
            """)
        )
        return [
            SeasonType(year=row.year, total_pit_time=row.total_pit_time)
            for row in result.all()
        ]

    @strawberry.field
    async def races_by_season(
        self,
        info: strawberry.types.Info,
        year: int
    ) -> List[SeasonRaceType]:
        races = await info.context["dataloaders"]["races"].load(year)
        return [
            SeasonRaceType(
                id=r["id"],
                official_name=r["official_name"],
                round=r["round"],
                year=r["year"],
                total_pit_time=r["total_pit_time"]
            )
            for r in races
        ]

    @strawberry.field
    async def race_pit_stops(
        self,
        info: strawberry.types.Info,
        race_id: int
    ) -> List[DriverPitStopType]:
        stops = await info.context["dataloaders"]["pit_stops"].load(race_id)
        return [
            DriverPitStopType(
                driver_id=s["driver_id"],
                constructor_id=s["constructor_id"],
                total_pit_time=s["total_pit_time"],
                stop_count=s["stop_count"]
            )
            for s in stops
        ]


schema = strawberry.Schema(
    query=Query,
    config=StrawberryConfig(batching_config={"max_operations": 50})
)
graphql_app = GraphQLRouter(schema, context_getter=get_context)