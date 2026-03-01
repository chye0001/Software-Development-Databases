# Initialize project
First install all dependencies:
```bash
npm i
```

# Starting up local databases (Postgres & MongoDB) via Docker
Set up .env file based on .env.example, or with your own credentials. Should look something like this:

Postgres credentials:
```
POSTGRES_DATABASE_URL=postgresql://postgres:postgres@localhost:5432/postgres

POSTGRES_PORT=5432
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=postgres
DB_VOLUME=database_volume
```

MongoDB credentials:
```
MONGO_DB_URI=mongodb://localhost:27018/mongo?directConnection=true 
MONGO_DB=mongo
```

To start up the local databases, run the following command:
```bash
docker compose -f docker-compose.db.yml up -d
```

To understand how to work with the local databases using Prisma & Mongoose see the [README.md](./database/README.md) located in the /database folder. 


# Starting up backend
Run the following command to start up the local backend:
```bash
npm run dev
```

