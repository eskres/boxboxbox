# BoxBoxBox

Explore Formula 1 race data through interactive charts and visualisations.

## Stack

**Infra**
- Docker
- Python 3.12+
- Node.js 22+

**Backend**
- FastAPI
- Strawberry GraphQL
- SQLAlchemy 2.0
- OpenF1 API proxy with Redis caching and rate limiting
- PostgreSQL with F1DB, containerised with Docker

**Frontend**
- Next.js (App Router)
- D3.js
- Tailwind CSS

## Local development

```bash
cp .env.example .env
docker compose up -d
npm ci
```

### API
```bash
cd api
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload
```

### Web
```bash
npx nx dev web
```

## Database setup

Download the latest PostgreSQL export from the [F1DB releases page](https://github.com/f1db/f1db/releases), then restore it:

```bash
cat f1db-sql-postgresql.sql | docker exec -i <postgres-container> psql -U f1 f1db
```

## Data sources

- [F1DB](https://github.com/f1db/f1db) - historical race results and pit stop data
- [OpenF1](https://openf1.org) - live and recent session telemetry
