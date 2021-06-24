# ADR 4: Groups Database Design 
_Author: Taliya Weinstein (1386891)_

## Date: 
7 June 2021


## Status: 
Superseded
Updated ADR: [ADR 5: Groups Database Design](https://github.com/witseie-elen4010/2021-008-project/blob/main/documentation/adrs/ADR%205-%20Groups%20Database%20Design.md)


## Context:
The groups database relational table is used to all the possible group options of the web application. The key considerations used for making the database design decisions are:

* Team members being largely inexperienced with database design
* The prefernce for relational design principles which incorporate normalised relations whereby relations are well-formed and encompass [only 1 business concept each](https://www.youtube.com/watch?v=kyGVhx5LwXw&list=PL1LIXLIF50uXWJ9alDSXClzNCMynac38g&index=4&ab_channel=Dr.DanielSoper)
* The group database table needs to capture the all the base properties associated with the logging the exsistence of the group within the database.

## Decision:
 We will design a groups table with 4 attributes:
 1. group_id - set as an identity.
 2. group_name - 40 character limitation, set to be a unique attribute 
 3. course_code - 10 character limitation
 4. date_created  - set to smalldatetime

We will utilise the group_id as the primary key (despite group_name also being a canditate key) for uniformity among other relation's primary keys (ie all using the relation's ID as the primary key).

We will allow only the course_code to have a null value as the absence of this value will not impact the overall descriptive properties of the table. Yet in the application code, we will enforce a course code be specified with group creation. 

## Consequences:
1. Groups table design achieves 3rd normal form thus enabling the elimination of redundant data , improves data quality and enables anomoly elimination for update,insert and delete.
2. Reduced redundant data [improves overall performance.](https://www.educba.com/third-normal-form/)
3. Each group_name is required to have a different name which allows users to be able to differentaite between groups of the same subject. 





