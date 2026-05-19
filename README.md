# F1 GraphQL API

A Python GraphQL API serving F1 pit stop data. Built as a learning project to explore FastAPI, Strawberry, and async SQLAlchemy.

Data is sourced from [F1DB](https://github.com/f1db/f1db), an open source Formula 1 database.

## Stack

 - FastAPI
 - Strawberry GraphQL
 - SQLAlchemy 2.0
 - asyncpg
 - PostgreSQL
 - Docker

## Set up - Docker and Python 3.11+.

```bash
docker compose up -d
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
uvicorn main:app --reload
```

## Database setup

Download the latest PostgreSQL export from the
[F1DB releases page](https://github.com/f1db/f1db/releases),
then restore it into the running container:

```bash
cat f1db-sql-postgresql.sql | docker exec -i graphql-api-postgres-1 psql -U f1 f1db
```

## Example query

```graphql
query {
  pitStops(raceId: 550) {
    driverId
    stop
    lap
    timeMillis
  }z
}
```

## Limitations
Partial models have been defined for the Driver and Race tables as well as the Pit Stop view. All remaining tables are unmapped and unavailable to query.