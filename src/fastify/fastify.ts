import Fastify from "fastify";
import cors from "@fastify/cors";
import websocket from '@fastify/websocket';
import { fastifyStatic } from '@fastify/static';
import { knxRouter } from "./router/knxRouter.js";
import path, { dirname } from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
console.log("DIRNAME ", __dirname)
const app = Fastify({
  logger: false,
});

app.register(cors, {
  origin: "*",
  methods: ["*"],
});
app.register(fastifyStatic, {
  root: path.join(__dirname, 'public')
})
app.register(websocket.default)
app.register(knxRouter, { prefix: "/api/knx" });

export const startHttpServer = async () => {
  const port = 5666;
  console.log(`Server is running on port ${port}`);

  try {
    await app.listen({
      host: "0.0.0.0",
      port: port
    });
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};
