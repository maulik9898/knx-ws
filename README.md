# KNX Backend API Documentation

## Table of Contents
1. [Introduction](#introduction)
2. [Types](#types)
   - [KnxMessage](#knxmessage)
   - [KnxEvent](#knxevent)
3. [REST API Endpoints](#rest-api-endpoints)
   - [Write Group Address](#write-group-address)
   - [Read Group Address](#read-group-address)
   - [Health Check](#health-check)
4. [WebSocket Communication](#websocket-communication)
   - [Connection](#connection)
   - [Message Format](#message-format)
   - [Event Types](#event-types)
     - [Write Event](#write-event)
     - [Read Event](#read-event)
   - [Server-to-Client Events](#server-to-client-events)
     - [GroupValue_Write Event](#groupvalue_write-event)
     - [GroupValue_Read Event](#groupvalue_read-event)
     - [GroupValue_Response Event](#groupvalue_response-event)
5. [Error Handling](#error-handling)
6. [Examples](#examples)
   - [Write Group Address](#write-group-address-example)
   - [Read Group Address](#read-group-address-example)
   - [WebSocket Communication](#websocket-communication-example)
7. [Usage](#usage)

## Introduction

The KNX backend API allows you to interact with KNX devices and perform various operations such as reading and writing group addresses. It provides REST endpoints for synchronous communication and supports WebSocket for real-time updates and asynchronous communication.

## Types

### KnxMessage

The `KnxMessage` type represents the message format used for communication with the KNX backend. It can be either a `KnxReadMessage` or a `KnxWriteMessage`.

```typescript
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
```

### KnxEvent

The `KnxEvent` type represents the event format used for WebSocket communication. It can be either a `KnxGroupValueWriteEvent`, `KnxGroupValueReadEvent`, or `KnxGroupValueResponseEvent`.

```typescript
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
```

## REST API Endpoints

### Write Group Address

Endpoint: `POST /api/knx/write`

Description: Writes a value to a specific group address.

Request Body:
```json
{
  "operation": "write",
  "groupAddress": "group_address",
  "value": "value_to_write",
  "dpt": "datapoint_type"
}
```

Successful Response:
- Status Code: 200 (OK)
- Body:
  ```json
  {
    "message": "Write successful"
  }
  ```

Error Responses:
- Status Code: 400 (Bad Request)
  - Body:
    ```json
    {
      "error": "Invalid operation"
    }
    ```
- Status Code: 500 (Internal Server Error)
  - Body:
    ```json
    {
      "error": "Write failed"
    }
    ```

### Read Group Address

Endpoint: `GET /api/knx/read`

Description: Reads the current value of a specific group address.

Request Parameters:
- `groupAddress` (string, required): The group address to read.

Successful Response:
- Status Code: 200 (OK)
- Body:
  ```json
  {
    "type": "GroupValue_Response",
    "source": "server",
    "destination": "group_address",
    "value": "current_value"
  }
  ```

Error Response:
- Status Code: 500 (Internal Server Error)
  - Body:
    ```json
    {
      "error": "Read failed"
    }
    ```

### Health Check

Endpoint: `GET /api/knx/health`

Description: Checks the connection status of the KNX backend.

Successful Response:
- Status Code: 200 (OK)

Error Response:
- Status Code: 404 (Not Found)

## WebSocket Communication

### Connection

To establish a WebSocket connection with the KNX backend, connect to the following URL:
- `ws://ip:port/api/knx/ws`

### Message Format

The WebSocket messages are exchanged in JSON format. Each message consists of an operation type (`read` or `write`) and associated data.

### Event Types

#### Write Event

Description: Requests a write operation on a specific group address.

Message Format:
```json
{
  "operation": "write",
  "groupAddress": "group_address",
  "value": "value_to_write",
  "dpt": "datapoint_type"
}
```

#### Read Event

Description: Requests a read operation on a specific group address.

Message Format:
```json
{
  "operation": "read",
  "groupAddress": "group_address",
  "callback": "optional_callback"
}
```

### Server-to-Client Events

The KNX backend sends the following events to all connected WebSocket clients:

#### GroupValue_Write Event

Description: Indicates that a group address value has been written.

Event Format:
```json
{
  "type": "GroupValue_Write",
  "source": "knx_device_address",
  "destination": "group_address",
  "value": "written_value"
}
```

#### GroupValue_Read Event

Description: Indicates that a group address value has been requested to be read.

Event Format:
```json
{
  "type": "GroupValue_Read",
  "source": "knx_device_address",
  "destination": "group_address"
}
```

#### GroupValue_Response Event

Description: Indicates the response to a read request, containing the current value of a group address.

Event Format:
```json
{
  "type": "GroupValue_Response",
  "source": "knx_device_address",
  "destination": "group_address",
  "value": "current_value"
}
```

## Error Handling

In case of an error, the API will respond with an appropriate HTTP status code and an error message in the response body.

Example Error Response:
```json
{
  "error": "Error message"
}
```

## Examples

### Write Group Address Example

Request:
```http
POST /api/knx/write
```
Request Body:
```json
{
  "operation": "write",
  "groupAddress": "1/0/1",
  "value": false,
  "dpt": "DPT1.001"
}
```

Successful Response:
```json
{
  "message": "Write successful"
}
```

Error Response:
```json
{
  "error": "Write failed"
}
```

### Read Group Address Example

Request:
```http
GET /api/knx/read?groupAddress=1/0/1
```

Successful Response:
```json
{
  "type": "GroupValue_Response",
  "source": "server",
  "destination": "1/0/1",
  "value": true
}
```

Error Response:
```json
{
  "error": "Read failed"
}
```

### WebSocket Communication Example

1. Connect to the WebSocket URL: `ws://ip:port/api/knx/ws`

2. Send a read event:
   ```json
   {
     "operation": "read",
     "groupAddress": "1/0/1"
   }
   ```

3. Receive a GroupValue_Response event:
   ```json
   {
     "type": "GroupValue_Response",
     "source": "1.1.100",
     "destination": "1/0/1",
     "value": true
   }
   ```

4. Send a write event:
   ```json
   {
     "operation": "write",
     "groupAddress": "1/0/1",
     "value": false,
     "dpt": "DPT1.001"
   }
   ```

5. Receive a GroupValue_Write event:
   ```json
   {
     "type": "GroupValue_Write",
     "source": "1.1.100",
     "destination": "1/0/1",
     "value": false
   }
   ```
## Usage

The KNX backend is packaged as a Docker container and can be deployed using the Docker CLI directly.

### Docker CLI


1. Open a terminal and run the following command:

```
docker run -d --network=host -e NODE_ENV=production maulik9898/knx-ws:latest
```

This command will pull the `maulik9898/knx-ws:0.0.1` image from the Docker Hub registry and start the container in detached mode. It will also run the container in the host's network mode and set the `NODE_ENV` environment variable to `production`.

Visit `http://localhost:5666` to open KNX testing page

2. To stop the container, first find its ID or name using `docker ps`, and then run:

```
docker stop <container_id_or_name>
```

