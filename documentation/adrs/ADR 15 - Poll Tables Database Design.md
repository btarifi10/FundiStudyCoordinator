# ADR 15: Poll Tables Database Design
_Author: Basheq Tarifi (1696842)_

## Date: 
13 June 2021

## Status: 
Accepted 


## Context:
The web app requires functionality for polls to be conducted. There are four types of polls identified:
1. Polls to invite a user to a group
2. Polls to accept a user who requested to join the group
3. Polls to ban a member from a group
4. Custom polls, which would add value to the end user and promote decision making as a group. These polls can have any outcome or number of options.

As such, poll details and results will need to be stored, to maintain a record of past polling events.

## Decision:
Two tables will be created: **polls** and **poll_stats**. The first table, **polls**, will have the following columns:
1. poll_id - the identity primary key
2. title - a VarChar, the title of the poll
3. start_date - a DateTimeOffset, the time the poll started
3. poll_type - a VarChar denoting the type of poll
4. duration - a Float representing the duration in hours
5. group_name - a VarChar, the group name of the group the poll takes place in
6. outcome - a VarChar, the outcome of the poll
7. user_id - an Integer, the user ID of the user affected

The second table, **poll_stats** will have the following columns:
1. pollstat_id - identity primary key
2. poll_id - a foreign key to **polls**
3. candidate - VarChar representing a voting option
4. votes - an Integer, the number of votes for the candidate

The table **polls** meets 2nd normal form while **poll_stats** meets 3rd normal form. The decision not to normalise **polls** further is a tradeoff between the number of tables and complexity, and good database design. While group_name may be subject to anomalies, the design requires group names to be unique and given that polls are recorded retrospectively, this does not present a major problem.

## Consequences:
1. There is some redundancy in the data. However, using the tables becomes much easier since the number of tables interacted with is minimal.
2. Since the database itself cannot assert certain things (such as the validity of group_name or poll_type), the developer has to ensure these are maintained and valid within the code itself.
3. The design may require change should the requirements and specifications of the web app change.





