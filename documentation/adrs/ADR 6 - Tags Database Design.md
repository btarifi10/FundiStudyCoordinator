# ADR 6: Tags Database Design 
_Author: Taliya Weinstein (1386891)_

## Date: 
20 June 2021


## Status: 
Accepted

## Context: 
Due to the need for the functionality of being able to have groups recommended based on a user's activity on the application, it is necessary to be able to have an attribute within the group database which enables similar groups to be bundled together. 

## Decision:
We will use a tags relational table as a one true lookup table to populate a tags attribute in the groups relational table.

We will design tags such that it has 2 attributes:
1. tag_id - an integer identity
2. tag - resticted to be 20 characters


We will use tag_id as the primary key.

## Consequences:
1. Users are restricted in the tags they can give ( 85 unique options). This does present a tradeoff between personalisable group tags and a more manageable constrained option list.
2. Constrained option list ensures that recomendations can be made based on linking groups of same tag together ( as if user specified tags were allowed, a more complex matching system would be required).



