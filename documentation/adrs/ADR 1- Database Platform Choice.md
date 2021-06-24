# ADR 1: Database Platform Choice  
_Author: Taliya Weinstein (1386891)_

## Date: 
7 June 2021


## Status: 
Accepted 

## Context: 
Due to the need for data persistence, a database management system is required for various storage requirements within the web applications. Considerations for this decision include: 

* The need for easy and quick intergration of the database management system with the hosting platform, Microsoft’s Azure.
* The preference for a database platform with an extension option on VS code.
* The stipulated project requirement that the database management system need be relational with SQL domain-specific lanuage. 
* The priority for a database management system with a shallow learning curve so as to enable team members to devote more time to the code implementation than database constuction.
*  The preference for a database management system that was utilised by at least one team member in the group to assist with setup.


## Decision:
We will use the Microsoft SQL Server.


## Consequences:
1. Faster coding implementation since setup was covered in Lab 5
2. The database hosting is linked to only one team member's Azure account (account used for hosting) thus disproportionately using that team member's free credits.
3. Easy database updates, table creation and management through VS code extention. 


