# ADR 19: Meetings Table Design
_Author: Yasser Karam (1624228)_

## Date: 
15 June 2021

## Status: 
Accepted 

## Context:
A user can schedule either an online or face-to-face meeting, and so it is required that the meetings associated to a specific group can be viewed upon entering a group chat (persistence). The key consideration used when making the database design decisions are:

* The specifics of where and when the meeting is taking place must be saved
* The group for which the meeting is taking place must be linked to the meeting
* The meeting can either be face-to-face which requires a physical address, or online which requires an online platform to be specified

## Decision:
Considering the variability in the 'type' of meeting that can take place, the **meetings** table is to have the following attributes/columns:
1. meeting_id - identity integer primary key
2. group_id - a foreign key to the [groups](ADR%205-%20Groups%20Database%20Design.md) table to identify which group the meeting is for
3. creator_id - a foreign key to the [users](ADR%203-%20User%20Database%20Design.md) table to identiy the user who created the meeting
4. meeting_time - datetimeoffset to record the time for which the meeting is scheduled to take place
5. place - varchar(8000) to account for physical addresses (or coordinates) and online platform names
6. link - link to online meeting or google maps link for directions to the meeting location
7. is_online - a boolean value (bit) to differentiate between face-to-face and online meetings

The `link` attribute may be null to allow the creator to insert the link at a later stage (to be implemented in future releases). The rest of the attributes cannot be null.

The `is_online` attribute allows the search for a meeting to differentiate the type of meeting that it is scheduled. In the case of a face-to-face meeting, the user cannot view the meeting scheduled unless they have passed the COVID [screening](ADR%7-%20Screening%20Database%20Design.md) 


## Consequences:
1. The table has been chosen to be designed as a single table to avoid unnecessary complexity. Two tables could be made for either online and face-to-face meetings, but that would not serve any simplicity or broaden functionality that is achieved in one table.
2. Since the database does not perform any asserts, it is up to the developer interacting with the database to perform asserts and checks to make sure that the database is populated with valid information such as links and addresses that confirm the `is_online` attribute.
