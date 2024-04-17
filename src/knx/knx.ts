import { Connection } from 'knx';
import { onKNXEvent } from './handleKnxEvent.js';


let knxConnected = false
export const isKNXConnected = () => {
  return knxConnected
}
export const knxConnection = new Connection({
  // ipAddr: "192.168.29.74",
  // ipPort: 3671,
  loglevel: "debug",
  // do not automatically connect, but use connection.Connect() to establish connection
  // use tunneling with multicast (router) - this is NOT supported by all routers! See README-resilience.md
  forceTunneling: true,
  // the KNX physical address we'd like to use
  handlers: {
    connected: function() {
      console.log("KNX Connected!");
      knxConnected = true
    },
    disconnected: function() {
      console.log("KNX Disconnected!");
      knxConnected = false
    },
    error: function(err) {
      console.log("Error: ", err);
    },
    event: onKNXEvent,
  },
});
