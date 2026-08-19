# Dashboard

## Start the application

To start the entire application, run the following command in the root directory of the project:

```bash
docker compose [--profile studio] [--profile seed] up --build [--watch]
```

this will start the backend server and the database. The backend server will be available at `http://localhost:3000`.

Use the `--watch` flag to enable hot reloading of the backend server. This will automatically restart the server when you make changes to the code.

Use the `--profile studio` flag to start the Prisma Studio. This will allow you to view and edit the database in a web interface. The Prisma Studio will be available at `http://localhost:5555`.

Use the `--profile seed` flag to seed the database with initial data. This will run the `prisma db seed` command. If the database, the seed commande will result in an error, because the database is already seeded. You can run the `prisma db seed` command manually to seed the database again.

The two profiles can be used together or separately but they may take 30 - 60 seconds to start, depending on your machine. ( The backend would still be available at `http://localhost:3000` while the profiles are starting.)

To remove the containers and the volumes, run the following command:

```bash
docker compose --profile studio --profile seed down -v
```


if you want to use expo command, you can run the following commande to attach to the expo container and run  the expo command :

```bash
docker attach expo-app
```

then you can run the expo command as you normally would.


