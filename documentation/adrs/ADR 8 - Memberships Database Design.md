# ADR 8: Memberships Database Design 
_Author: Taliya Weinstein (1386891)_

## Date: 
7 June 2021


## Status: 
Accepted

## Context: 
The memberships database relational table is used to record which users are members of which groups of the web application. The key considerations used for making the database design decisions are:

* Team members being largely inexperienced with database design
* The prefernce for relational design principles which incorporate normalised relations whereby relations are well-formed and encompass [only 1 business concept each](https://www.youtube.com/watch?v=kyGVhx5LwXw&list=PL1LIXLIF50uXWJ9alDSXClzNCMynac38g&index=4&ab_channel=Dr.DanielSoper)
* The memberships database table needing to capture the base properties associated with becoming a member of a specific group. 


## Decision:
We will design a memberships relation table with 4 attributes to capture the core principles behind joining a group:
1. membership_id - an integer identity 
2. user_id - an integer identity 
3. group_id - an integer identity
4. date_joined - smalldatetime 

We will set membership_id to be the primary key in the table since it is the only attribute which is capable of uniquely referencing any of the other rows.

We will set user_id to be a foreign key which references the [users table](https://github.com/witseie-elen4010/2021-008-project/blob/main/documentation/adrs/ADR%203-%20User%20Database%20Design.md) to assist with the relational database concept of having one table describing one business relationship.

We will set group_id to be a foreign key which references the [groups table](https://github.com/witseie-elen4010/2021-008-project/blob/main/documentation/adrs/ADR%205-%20Groups%20Database%20Design.md) to assist with the relational database concept of having one table describing one business relationship.

## Consequences:
1. The table is designed in 3rd normal form covering one business concept thus thus enabling the elimination of redundant data , improves data quality and enables anomoly elimination for update,insert and delete.
2. Reduced redundant data [improves overall performance.](https://www.educba.com/third-normal-form/)
3. Increased complexity in database calls to determine if the current user is a member of a specific group. 





