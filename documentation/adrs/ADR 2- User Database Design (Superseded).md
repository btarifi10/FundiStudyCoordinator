# ADR 2: Users Database Design (Superseded)
_Author: Taliya Weinstein (1386891)_

## Date: 
7 June 2021


## Status: 
Superseded  
Updated ADR: [ADR 3: Users Database Design ](https://github.com/witseie-elen4010/2021-008-project/blob/main/documentation/adrs/ADR%203-%20User%20Database%20Design.md)


## Context:
The users database relational table is used to store users of the web application. The key considerations used for making the decision are:

* Team members being largely inexperienced with database design
* The preference for relational design principles which incorporate normalised relations whereby relations are well-formed and encompass [only 1 business concept each](https://www.youtube.com/watch?v=kyGVhx5LwXw&list=PL1LIXLIF50uXWJ9alDSXClzNCMynac38g&index=4&ab_channel=Dr.DanielSoper)
* The users database table needs to capture the all the base properties associated with the users interaction with the web application. 

## Decision:
 We will design a users table with 6 attributes:
 1. user_id - set as an identity.
 2. username - A required unique attribute restricted to 20 characters 
 3. name - 20 character limitation
 4. surname - 20 character limitation
 5. password - 100 character limitation
 6. rating - A float 

We will utilise the user_id as the primary key (despite username also being a canditate key) for uniformity among other relation's primary keys (ie all using the relation's ID as the primary key).

We will allow only the password and rating to have null values. 

## Consequences:
1. Users table design achieves 3rd normal form thus enabling the elimination of redundant data, improves data quality and enables anomaly elimination for update, insert and delete.
2. Reduced redundant data [improves overall performance.](https://www.educba.com/third-normal-form/)

