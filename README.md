# Initialize project
First install all dependencies:
```bash
npm i
```

# Starting up local database via Docker
Set up .env file based on .env.example, or with your own credentials. Should look something like this:
```
POSTGRES_PORT=5432
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=postgres
DB_VOLUME=database_volume
```


To start up the local database, run the following command:
```bash
docker-compose up -d
```

# Starting up backend
Run the following command to start up the local backend:
```bash
npm run dev
```

