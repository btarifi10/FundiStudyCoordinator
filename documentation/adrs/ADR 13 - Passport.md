# ADR 13: Passport 
_Author: Basheq Tarifi (1696842)_

## Date: 
26 June 2021

## Status: 
Accepted

## Context: 
The web application requires users to log in with a username and password, having a secure and unique account. Furthermore, a user should comfortably sign in once and remain signed in until they sign out or become inactive for a duration of time. In order to implement this, there are several factors to be considered:
- Creating an account on registration
- Signing in and maintaining a session
- Controlling access to pages based on authentication

Within the express based application, _cookie_ or _session_ based authentication are two possibilities. However, storing the data in a cookie is less secure since all the data is within the client.

## Decision:
[Passport](http://www.passportjs.org/) will be used to implement the features listed above for the following reasons

* **Express-based** - it can be easily incorporated into the application
* **Maintains sessions** - users can sign on once persistently, only the session ID is stored within a cookie
* **Success or failure based actions** - control of what should happen on successful or failed sign in attempts
* **Multiple strategies** - allows for the application to be more versatile in future
* **Authentication** - requests made to the serve are easily authenticated

## Consequences:
1. Persistent sign in will be made possible, meaning users only need to sign in once
2. Sessions are secure since only a session ID is kept within the client
3. Every request made to the server is easy to authenticate, so access to pages can be controlled
4. Less data needs to be sent in requests since every request will contain embedded user details
5. In future, signing in with Google and other providers can be made possible
