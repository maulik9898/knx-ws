import { WebSocket } from "@fastify/websocket";
import { FastifyInstance, FastifyPluginCallback } from "fastify";
import { KnxMessage, KnxOperation } from "../../types.js";
import { isKNXConnected, knxConnection } from "../../knx/knx.js";
import { readKNXData } from "../../knx/readKNXData.js";


export let websocketClients: Set<WebSocket> = new Set();
export const knxRouter: FastifyPluginCallback = (
  fastify: FastifyInstance,
  _,
  done,
) => {
  fastify.get("/ws", { websocket: true }, (socket) => {
    websocketClients.add(socket)

    socket.on("message", (message: string) => {
      const data = JSON.parse(message.toString()) as KnxMessage;
      console.log("message ", JSON.parse(message))
      switch (data.operation) {
        case KnxOperation.Write:
          // Perform write operation on KNX
          knxConnection.write(data.groupAddress, data.value, data.dpt);
          break;
        case KnxOperation.Read:
          // Perform read operation on KNX
          knxConnection.read(data.groupAddress);
          break;
        default:
      }
    })

    socket.on("close", () => {
      websocketClients.delete(socket)
    })
  });

  fastify.get("/health", (_, reply) => {
    if (isKNXConnected()) {
      reply.status(200).send()
    } else {
      reply.status(404).send()
    }
  });

  fastify.post<{ Body: KnxMessage }>("/write", async (request, reply) => {
    const data = request.body;

    if (data.operation === KnxOperation.Write) {
      try {
        knxConnection.write(data.groupAddress, data.value, data.dpt);
        reply.send({ message: "Write successful" });
      } catch (error) {
        reply.status(500).send({ error: "Write failed" });
      }
    } else {
      reply.status(400).send({ error: "Invalid operation" });
    }
  });

  // HTTP GET route for reading KNX data
  fastify.get<{ Querystring: { groupAddress: string } }>("/read", async (request, reply) => {
    const { groupAddress } = request.query;
    console.log("READ from", groupAddress)

    try {
      const knxEvent = await readKNXData(groupAddress);
      reply.send(knxEvent);
    } catch (error) {
      reply.status(500).send({ error: "Read failed" });
    }
  });
  done();
};
