# ADR 16: Invites and Requests Tables Design
_Author: Basheq Tarifi (1696842)_

## Date: 
9 June 2021

## Status: 
Accepted 

## Context:
Joining a group can be achieved in two ways:
- A user can request to join a group, which the group may accept or reject
- A group may invite a user, which the user may accept or reject

## Decision:
 Given the similarity in the two abovementioned situations, two tables with similar structures will be designed as follows:

 The **invites** table will have the following attributes:
 1. invite_id, an identity primary key
 2. receiver_id, a foreign key to the [users](ADR%203-%20User%20Database%20Design.md) table and the ID of the user being invited
 3. group_id, a foreign key to the [groups](ADR%205-%20Groups%20Database%20Design.md) table and the ID of the group inviting the user
 4. time_sent, a DateTimeOffset of the time the invite was sent.

Similarly, the **group_requests** table will have:
 1. requests_id, an identity primary key
 2. user_id, a foreign key to the [users](ADR%203-%20User%20Database%20Design.md) table and the ID of the user requesting to join the group
 3. group_id, a foreign key to the [groups](ADR%205-%20Groups%20Database%20Design.md) table and the ID of the group being requested
 4. time_sent, a DateTimeOffset of the time the request was sent.
 
All of these properties will not be null.

These tables achieve 3rd normal form which is important since they will be modified and interacted with very often, resulting in entries being added and deleted.

## Consequences:
1. Both tables achieve 3rd normal form thus enabling the elimination of redundant data, improves data quality and enables anomaly elimination for update, insert and delete.
2. Reduced redundant data [improves overall performance.](https://www.educba.com/third-normal-form/)
3. The normalisation and use of integer primary keys results in increased effort by the developer to perform operations on multiple tables.





