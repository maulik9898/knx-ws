import { KnxEvent, KnxEventType } from "../types.js"
import { knxConnection } from "./knx.js";
export async function readKNXData(groupAddress: string): Promise<KnxEvent> {
  try {
    const  { src, value} = await new Promise<{ src: string; value: Buffer }>((resolve, _) => {
      knxConnection.read(groupAddress, (src, value) => {
        resolve({ src, value });
      });
    });

    const knxEvent: KnxEvent = {
      type: KnxEventType.GroupValueResponse,
      source: src,
      destination: groupAddress,
      value: value[0],
    };

    return knxEvent;
  } catch (error) {
    throw new Error("Read failed");
  }
}
