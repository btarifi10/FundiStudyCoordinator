# ADR 18: Messages Table Design
_Author: Yasser Karam (1624228)_

## Date: 
7 June 2021

## Status: 
Accepted 


## Context:
The group chat messages need to be saved (persistence) such that a group member can sign in and find the past messages of a group chat. The key consideration used when making the database table design decisions are:

* The messages must be related to a specific group such that each group can retrieve it's messages
* The messages will need to be attached to a specific user and time such that the display can accurately represent the chat as it occured in the group.

## Decision:
A **messages** relational table will be have the following attributes/columns:
1. message_id - identity primary key
2. user_id - a foreign key of the [users](ADR%203-%20User%20Database%20Design.md) table, the user who sent the message
3. group_id - a foreign key to the [groups](ADR%205-%20Groups%20Database%20Design.md) table, the group in which the message was sent
4. text_sent - a char(1000) to fit a large text sent in the group chat
5. time_sent - a datetimeoffset, the time that the message is sent

The **messages** table can be filtered according to `group_id` and `time_sent` such that the group chat can be accurately reconstructed.


## Consequences:
1. The **messages** table is designed in [3rd normal form](https://www.educba.com/third-normal-form/) covering one business concept thus allowing for the elimination of redundant data. This improves the data quality, and enables anomily free searches and inserts.
2. Since the database cannot assert certain parameters to be met, the developer must ensure that messages, dates, and other attributes are valid so as not to corrupt the database upon insertion, or upon extraction.