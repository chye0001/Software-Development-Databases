# Start up local database
Starting up the local database instance simply navigate to the root of the project in the terminal.
Then execute the folllowing command: 

```bash
docker compose up
```
This will start up a local instance of a Postgress database, using a default volume named: "default_volume". 
You can change and initilise different volumes using the following command:

```bash
DB_VOLUME="name_of_your_choise" docker compose up
```

or simply set the value of DB_VOLUME in the [.env](.env) file and run:
```bash
docker compose up
```


# Working with Prisma

## Initial Prisma setup after clonning repository
After pulling the code base, you need to sync you local database. You do this by calling the following command:

```bash
npm run prisma:push
```

This will read your [schema.prisma](./prisma/schema.prisma) file and push and apply it to the local database. 


Afterwards you need to run:

```bash
npm run prisma:generate
```
This will generate a database client, which the backend application can use to communicate with the database.


## Seeding the database
To seed the database with test data run the following command:
```bash
npm run prisma:seed
```
This will execute the [seed.ts](./prisma/seed.ts) file found under ./database/prisma.


## Reseting the database
To reset or truncate the entire database, in other words... 
This will delete all data and re-run migrations from scratch, just simply execute the following command:

```bash
npm run prisma:reset
```

## Creating migrations and applying them 
To make changes to the database, you should make changes to the [schema.prisma](./prisma/schema.prisma) file.
Afterwards run the following command:
```bash
npm run prisma:migrate
```
This will generate a migration file and place it in the [/migrations](./prisma/migrations/) folder and apply them directly to the database you are connected to. Afterwards it will automatically generate a database client and sync it with the changes to [schema.prisma](./prisma/schema.prisma) - the database has to be running for it to apply the changes, otherwise it will only create the migrations file.


## Connect to the Postgre Database
There a multiple ways to connect to the Postgre database, but the simplest is to do:
```bash
npm run prisma:studio
```

Otherwise you can connect using DataGript or Dbeaver - just a Database Client that supports Postgre.
The credentials can be found in the [.env](../.env) file located at the root of the project.
