# ADR 3: Users Database Design 
_Author: Taliya Weinstein (1386891)_

## Date: 
17 June 2021


## Status: 
Accepted

## Context:
The users database relational table is used to store users of the web application.During the design of the rating functionlity, the decision was taken to update ratings based on calculating the new average of the overall ratings. Previously the table only included an float attribute of Rating. 


## Decision:
 We will add an additional attribute to the users table called number_ratings to capture the overall number of ratings a user has received across all study groups since they signed up for the web application.

 We will have a users table with 7 attributes: 
 1. user_id - set as an identity.
 2. username - A required unique attribute restricted to 20 characters 
 3. name - 20 character limitation
 4. surname  - 20 character limitation
 5. password - 100 character limitation
 6. rating - A float 
 7. number_ratings- an integer

 We will utilise the user_id as the primary key (despite username also being a canditate key) for uniformity among other relation's primary keys (ie all using the relation's ID as the primary key).

We will allow only the password, rating and number_ratings to have null values. 

## Consequences:
1. Users table design achieves 3rd normal form thus enabling the elimination of redundant data , improves data quality and enables anomoly elimination for update,insert and delete.
2. Reduced redundant data [improves overall performance.](https://www.educba.com/third-normal-form/)
3. Included attribute of number_ratings enables the rating column to be able to be updated based on a recalculation of the average [( old_rating* number_ratings + new_rating)/ number_ratings+1] thus enabling a more comprehensive rating system. 
