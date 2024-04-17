// KnxMessage.ts

export enum KnxOperation {
  Read = 'read',
  Write = 'write',
}

export interface KnxReadMessage {
  operation: KnxOperation.Read;
  groupAddress: string;
  callback?: string;
}

export interface KnxWriteMessage {
  operation: KnxOperation.Write;
  groupAddress: string;
  value: any;
  dpt: string;
}

export type KnxMessage = KnxReadMessage | KnxWriteMessage;

// KnxEvent.ts

export enum KnxEventType {
  GroupValueWrite = 'GroupValue_Write',
  GroupValueRead = 'GroupValue_Read',
  GroupValueResponse = 'GroupValue_Response',
}

export interface KnxGroupValueWriteEvent {
  type: KnxEventType.GroupValueWrite;
  source: string;
  destination: string;
  value: any;
}

export interface KnxGroupValueReadEvent {
  type: KnxEventType.GroupValueRead;
  source: string;
  destination: string;
}

export interface KnxGroupValueResponseEvent {
  type: KnxEventType.GroupValueResponse;
  source: string;
  destination: string;
  value: any;
}

export type KnxEvent = KnxGroupValueWriteEvent | KnxGroupValueReadEvent | KnxGroupValueResponseEvent;
