# ADR 10: Test Database
_Author: Nathan Jones (1619191)_

## Date: 
25 June 2021


## Status: 
Accepted

## Context: 
In order to properly test our app, it is important that we are able to test whether information is being stored and retrieved correctly from the database, and remains persistent between sessions. However, using the same database for testing and production has 3 major disadvantages:

1. Tests will create fictitious data entries visible to end users, which may lead to confusion or dissatisfaction.
2. Tests will be non-deterministic, since tests cannot predict what users will add to the database between tests. This results in flakey tests.
3. Some tests may require drastic changes to the database entries, like clearing entire tables. This would completely disrupt the end-user experience


## Decision:
A test database will be setup that can be used when running all of our tests. This database will be a replica of the production database in all but table entries. Environment variables will be used to control which database is accessed depending on where it is being deployed (locally, Travis CI, Azure etc).

In order to manipulate the database during the tests to ensure testing conditions are deterministic, a special set of routes will be defined that can be utilised with `fetch()` calls throughout the testing process to make queries. The environment variables will also be used to disable these paths when the app is deployed in a production environment. This will ensure that users cannot make test-specific manipulations to the database.

## Consequences:
1. The production database will not be polluted with testing artifacts.
2. Tests will not disturb the end-user experience.
3. Tests will be able to prepare the state of the database before and after each test to ensure that tests are deterministic and not flakey
4. Changes made to the production database need to be consistently updated and replicated in the test database




