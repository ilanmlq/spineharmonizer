import "dotenv/config";
import { buildApp } from "./app.js";
import { disconnectPrisma } from "./plugins/prisma.js";

const app = buildApp();
const port = Number(process.env.PORT ?? 3000);
const host = process.env.HOST ?? "0.0.0.0";

const server = app.listen(port, host, () => {
  console.log(`Server listening on http://${host}:${port}`);
});

async function shutdown() {
  server.close(async () => {
    await disconnectPrisma();
    process.exit(0);
  });
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
