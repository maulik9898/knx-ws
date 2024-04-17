import { websocketClients } from "../fastify/router/knxRouter.js";
import { KnxEvent, KnxEventType } from "../types.js";

export const onKNXEvent = (evt: string, src: string, dest: string, value: Buffer) => {
  console.log(evt, src, dest, value);
  let val = value.toJSON().data[0]
  console.log(val)
  // Create a KnxEvent object based on the event type
  let knxEvent: KnxEvent;
  switch (evt) {
    case 'GroupValue_Write':
      knxEvent = {
        type: KnxEventType.GroupValueWrite,
        source: src,
        destination: dest,
        value: val,
      };
      break;
    case 'GroupValue_Read':
      knxEvent = {
        type: KnxEventType.GroupValueRead,
        source: src,
        destination: dest,
      };
      break;
    case 'GroupValue_Response':
      knxEvent = {
        type: KnxEventType.GroupValueResponse,
        source: src,
        destination: dest,
        value: val,
      };
      break;
    default:
      // Ignore unknown events
      return;
  }
  // Send the KNX event to all connected WebSocket clients
  websocketClients.forEach(client => {
    client.send(JSON.stringify(knxEvent));
  });
}
