# ADR 14: Chart.js
_Author: Basheq Tarifi (1696842)_

## Date: 
26 June 2021

## Status: 
Accepted

## Context: 
There are multiple real time polls that can be voted on within the web app, and viewing these results is necessary.

While basic stats can be shown in a table, realtime visualisation of poll results will greatly improve the user experience. Charts are the most logical and intuitive way of visualising voting results.

## Decision:
[Chart.js](https://www.chartjs.org/) will be used to create charts which visualise the poll results.

* **Light weight and well documented** - easy to incorporate
* **Responsive** - resizes with the window
* **Multiple chart types** - the most aesthetically appealing can be used

## Consequences:
1. Visualisation of polls is possible, enhancing the user experience
2. Changes to votes are viewed easily in real time
3. Testing of the displayed results is made difficult
