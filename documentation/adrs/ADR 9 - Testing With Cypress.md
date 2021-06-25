# ADR 9: Testing With Cypress 
_Author: Nathan Jones (1619191)_

## Date: 
25 June 2021


## Status: 
Accepted

## Context: 
The vast majority of the website's functionality is composed of CRUD activities (Create, Read, Update and Delete). This means that the app's business logic is concerned mainly with displaying elements in the user's browser or storing information in a database. This kind of web app lends itself well to the capabilities of [end-to-end tests](https://www.browserstack.com/guide/end-to-end-testing), which cover the entire workflow of the application. While Jest can be extended to facilitate this using [puppeteer](https://jestjs.io/docs/puppeteer) to make assertions about DOM elements, more accessible solutions are available. 


## Decision:
[Cypress](https://www.cypress.io/) will be used to write end-to-end tests for our web application, with Jest being used occasionally where unit tests are applicable. Cypress has the following advantages:

* **Easy to use** - The syntax is easy to understand, making referencing DOM elements and making assertions more efficient.
* **Well documented** - The Cypress [documentation](https://docs.cypress.io/guides/core-concepts/introduction-to-cypress) is extremely comprehensive and easy to understand, with many examples of how to utilise its functionality.
* **Supports Coveralls** - While this is yet to implemented, it is important that we will still be able to assess code coverage in our tests
* **GUI runtime** - Cypress allows tests to be run from within a browser, visually showing the steps and procedures that you have programmed. This greatly aids the process of debugging one's tests
* **Less flaky tests** - Due to the fact that the Cypress testing procedure mimics the experience of a real user in a real browser, these tests can more accurately test the system, taking into account external factors like time delays.

> **NOTE**: In order to avoid polluting the public data base, a test database will be setup to facilitate the testing process. This can be manipulated freely to ensure that tests are deterministic and not flakey or dependant on previous states/tests

## Consequences:
1. Extra work will need to be invested to integrate Cypress wih Travis CI and Coveralls.
2. Team members will need to understand the basics of both Jest and Cypress syntax.
3. Tests that better reflect the capabilities of the app can be written.
4. The integration between app features can be more rigorously tested without the need for mocking elements.
5. Persistence can be tested by asserting whether elements are loaded correctly from the test database





