# ADR 5: Group Database Design 
_Author: Taliya Weinstein (1386891)_

## Date: 
20 June 2021

## Status: 
Accepted 


## Context:
The groups database relational table is used to store all created groups on the web application. During the design of functionlity for automatically making a recommendation of groups to join, there was a need to update the groups table to encompass a description for easier linking across all groups.


## Decision:
 We will add an additional attribute to the groups table called tag which will be a foreign key of the [lookup table tags](https://github.com/witseie-elen4010/2021-008-project/blob/main/documentation/adrs/ADR%206%20-%20Tags%20Database%20Design.md). This will enable the user, upon group creation to select a catergory for the group and subsequently enable the recommendation algorithm to recommend groups to the user based on their current group tags. 

 We will have a group table with 5 attributes: 
 1. group_id - set as an identity.
 2. group_name - 40 character limitation, set to be a unique attribute 
 3. course_code - 10 character limitation
 4. date_created  - set to smalldatetime
 5. tag - an integer foreign key from tag.

We will utilise the group_id as the primary key (despite group_name also being a canditate key) for uniformity among other relation's primary keys (ie all using the relation's ID as the primary key).

We will allow only the course_code and the tag value to be null. The course_code's absence will not impact the overall descriptive properties of the table.  

## Consequences:
1. User table design achieves 3rd normal form thus enabling the elimination of redundant data , improves data quality and enables anomoly elimination for update,insert and delete.
2. Reduced redundant data [improves overall performance.](https://www.educba.com/third-normal-form/)
3. Each group_name is required to have a different name which allows users to be able to differentaite between groups of the same subject. 
4. A null value in the tag would prevent automtic recommendations of groups to occur ( yet specifying a group tag is required in the application code).





