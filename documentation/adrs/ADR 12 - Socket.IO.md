# ADR 12: Socket.IO 
_Author: Nathan Jones (1619191)_

## Date: 
26 June 2021

## Status: 
Accepted

## Context: 
Several important features of our web application require the use of real-time, bidirectional communication between the clients and the server. These features include:

1. Sending messages to other members in a specific group chat
2. Being able to see which users are currently in a particular chat, as well as when they join or leave.
3. Handling live polling events to vote on group decisions.
4. Perform real-time tracking for group members while attending a face-to-face meeting.


## Decision:
[Socket.IO](https://socket.io/docs/v4/index.html) will be used to implement the features listed above for the following reasons

* **Real-time** - Data can be sent and received at any time.
* **Bidirectional** - Data can travel in both directions between server and client.
* **Event based** - Separate events can be made to listen for data of a particular nature, making it possible to easily handle several forms of real-time communication concurrently.
* **Broadcast capabilities** - The API makes it easy to send messages to multiple clients with a single function call.
* **Reliability** - If a [Websocket](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket) cannot be established, HTTP is used as a backup, making connection failures very rare.
* **Buffering** - Packets are automatically buffered if there is an interrupted connection, meaning that they can still be sent once the connection is restored.
* **Multiplexing** - The use of Namespaces allows the server to communicate with different groups of clients over a single connection. This is perfect for our application, since real time messages need to be confined to members within a particular group.

## Consequences:
1. Real time, bidirectional and event-based data transfer will be made possible for our web app
2. Group messages, polls and location-sharing can all be implemented using a similar implementations, which simplifies the design details to a single foundation.
3. Testing real time interactions is difficult and prone to errors





