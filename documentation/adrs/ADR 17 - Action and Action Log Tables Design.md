# ADR 8: Action and Action Log Tables Design
_Author: Yasser Karam (1624228)_

## Date: 
17 June 2021

## Status: 
Accepted

## Context: 
The action and action log tables are required for the storage of the passive monitoring of the users' activities. The key consideration used when making the database design decisions are:

* The list of actions may be adjusted in the future, and so the database must be able to handle the expansion of the list to other possible actions
* Each group chat will have the ability to view the activities carried out by other members in the same group.

## Decision:
Given the current functionality, we have decided to log the following actions:
* POLL - This would be the start and end of each poll, as well as the type of poll it is, as well as its outcome
* INVITE - Users can be invited to a group on either group creation or on the outcome of a POLL to invite a user
* CREATED - Group creation
* MEETING - When a meeting is created by a user in a group, as well as the time and place for the meeting
* SCREENING - The result of a COVID screening is logged for every group a user is a member of
* MESSAGE - Messages sent in a group chat
* ENTER - When a user enters a group chat
* LEAVE - When a user leaves a group chat

Each of these actions have associated to them; a user, a group, a date/time. A description is required to specify the message to be shown to the user describing the event (this is hard coded in the client side). The following outlines the attributes/columns of the tables made, and what each shall contain.

The **actions** table will have the following attributes:
1. action_id - an integer identity primary key
2. action - the actions listed above would each be a separate record/entry in the table

The **action_log** relational table will have the following attributes:
1. log_id - an integer identity primary key
2. action_id - a foreign key to the `action` table
3. group_id - a foreign key to the [groups](ADR%205-%20Groups%20Database%20Design.md) table. This is the group in which the action occured.
4. user_id - a foreign key to the [users](ADR%203-%20User%20Database%20Design.md) table. This is the user who initiated the action, and in the case of an POLL - the user who is being voted on.
5. timestamp - smalldatetime logging when an action occured
6. description -  This varies for each action and contains an html friendly message that can be displayed to the users of a group upon viewing the group's activity log.

All the attributes mentioned above will not be null. The action_log table will not be deleted, only added to and so will become very large very quickly.

The time, action and descriptions can be used for filtering upon display to the user.

## Consequences:
1. The action_log table is designed in [3rd normal form](https://www.educba.com/third-normal-form/) covering one business concept thus allowing for the elimination of redundant data. This improves the data quality, and enables anomily free updates, inserts, and deletions.
3. The action table is designed in 2nd normal form
4. The separation of the action from the action_log table allows for future additions to be made, and finer adjustments to better conform to the business interest.
5. The logging of actions amongst several users at the same time may cause delays in the performance of the database and server 



