# ADR 11: Google Maps API
_Author: Tarryn Maggs (719597)_

## Date: 
16 June 2021

## Status:
Accepted

## Context: 
This website requires the option to choose between creating an online or face-to-face meeting. In order to create a face-to-face meeting, the user needs to be able to choose an applicable address. Furthermore, when a user elects to attend a face-to-face meeting, the website needs to be able to track and display the user's location. 


## Decision:
The [Google Maps API](https://developers.google.com/maps/documentation/javascript/overview#maps_map_simple-html) will be used where location services are required. This is because there is extensive documentation and support on the use of the API's as well as the fact that it is easy to use and integrate. The following primary features will be used:

* **[Maps Embed API](https://developers.google.com/maps/documentation/embed/get-started)** - in the create meeting functionality. This will make sure that the user can type in an address and see it displayed on a map on the page for 'confirmation'. 
* **[Distance Matrix API](https://developers.google.com/maps/documentation/distance-matrix/overview)** - in the create meeting functionality. This will be used to compute the distances by road for multiple origins to multiple distance to determine the most central location that may be used as a suggested meeting location. 
* **[Google Maps API](https://developers.google.com/maps/documentation/javascript/overview#maps_map_simple-html)** - in the meeting attendance page. This will be used to display the location of the users who are 'attending' the face-to-face meeting. 


## Consequences:
1. API key required, which means that a team member needed to include their billing details to obtain access.
2. Although a credit was provided for the above, each request with the API key incurs a cost. Therefore the number of requests made needs to be limited.
3. The map locations can easily be translated to a directions link.
4. There is extensive support on browsers for google maps.