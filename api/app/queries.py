from datetime import date as Date

from sqlalchemy import select, cast, Integer
from sqlalchemy.ext.asyncio import AsyncSession

from app.models import Driver, Race, RaceData


async def get_race_results(
    db: AsyncSession, year: int, race_date: Date
) -> list:
    """Finishing order for a race: rows of (driver_number: int, abbreviation, constructor_id)."""
    stmt = (
        select(
            cast(RaceData.driver_number, Integer).label("driver_number"),
            Driver.abbreviation,
            RaceData.constructor_id,
        )
        .join(Race, RaceData.race_id == Race.id)
        .join(Driver, RaceData.driver_id == Driver.id)
        .where(
            RaceData.type == "RACE_RESULT",
            Race.year == year,
            Race.date == race_date,
            RaceData.driver_number.is_not(None),
        )
        .order_by(RaceData.position_number)
    )
    result = await db.execute(stmt)
    return result.fetchall()


async def get_season_driver_map(db: AsyncSession, year: int) -> dict[int, str]:
    """driver_number -> abbreviation for all drivers in completed races this season."""
    stmt = (
        select(
            cast(RaceData.driver_number, Integer).label("driver_number"),
            Driver.abbreviation,
        )
        .join(Race, RaceData.race_id == Race.id)
        .join(Driver, RaceData.driver_id == Driver.id)
        .where(
            RaceData.type == "RACE_RESULT",
            Race.year == year,
            RaceData.driver_number.is_not(None),
        )
        .distinct()
    )
    result = await db.execute(stmt)
    return {row.driver_number: row.abbreviation for row in result.fetchall()}
