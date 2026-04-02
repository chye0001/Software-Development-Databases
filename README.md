# Initialize project
First install all dependencies:
```bash
npm i
```

# Starting up local databases (Postgres & MongoDB) via Docker
Set up .env file based on .env.example, or with your own credentials. Should look something like this:

Postgres credentials:
```
POSTGRES_DATABASE_URL_DEV=postgresql://postgres:postgres@localhost:5432/postgres

POSTGRES_PORT_DEV=5432
POSTGRES_USER_DEV=postgres
POSTGRES_PASSWORD_DEV=postgres
POSTGRES_DB_DEV=postgres
DB_VOLUME_DEV=database_volume
```

MongoDB credentials:
```
MONGO_DB_URI_DEV=mongodb://localhost:27018/mongo?directConnection=true 
MONGO_DB_DEV=mongo
```

Neo4j credentials:
```
NEO4J_URL_DEV="neo4j://localhost:7687"

NEO4J_USERNAME_DEV="neo4j"
NEO4J_PASSWORD_DEV="password"
NEO4J_DB_DEV="neo4j" 
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

