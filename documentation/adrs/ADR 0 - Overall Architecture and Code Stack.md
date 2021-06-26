# ADR 0: Overall Architecture and Code Stack
_Author: Basheq Tarifi (1696842)_

## Date: 
29 May 2021

## Status: 
Accepted

## Context: 
A web app which helps study groups meet, communicate and work together needs to be built and will consist of multiple features including, but not limited to:
- User accounts
- Creating and becoming a member of study groups
- Organising meetings, both online and face to face
- Chatting within a group and accessing external links
- COVID-19 Screening
- Voting on group decisions

This presents a wide scope of activities and results in a complex web app requiring a well defined structure, agreed upon by group members to promote efficient collaboration and the delivery of a successful product using agile principles.

## Decisions:

The architecture as well as choice of stack will be discussed here.

### Architecture
The overall architecture will consist of a loosely implemented Model View Controller (MVC) pattern to promote separation of concerns and a clean codebase. This pattern promotes modularity and separation of concerns as follows:
- The **Model** consists of the logic layer of the code, making changes to data.
- The **View** consists of what the user sees, rendered on the client side.
- The **Controller** is what links the two, and alters the model based on client interactions with the view

While this will be promoted using routers and modules in the code, non-strict conformity will be allowed given that the developers are new to web development.

This MVC pattern, or at least, any of the three components, will be observed through the client and server. A typical pathway should be as follows:
A user interacts wuth an HTML page (a _view_) and this can either change data within the client (a _model_) or send data to the server (via a _controller_). The data (or _model_) on the server can then be modified (via a _controller_) and returned to the client to be rendered (the _view_).

### Code stack
1. HTML5, CSS and JavaScript will be used for the client.
2. Bootstrap classes will be used to promote easy and consistent styling of the client.
3. The server will be an Express server running on Node.js, resulting in JavaScript being used for the server too.
4. The server will expose REST API endpoints which can be called via HTTP requests and return JSON data.
5. The web app will be deployed on Azure.
6. An Azure SQL Server database will be used (see [ADR 1]('./ADR 1- Database Platform Choice.md') for more details)

These were chosen both due to the requirements of the project as well as due to familiarity with the developers since they the tools used in the course.

## Consequences:
1. A codebase which promotes modular code and separation of concerns
2. Third party services which are available through the Node Package Manager (NPM) can be easily incorporated
3. Developers need to work harder to maintain a uniform codebase and promote good coding practices with separation of concerns.
4. Developers need to ensure that once a page is styled, it is consistent with the rest of the web app.




