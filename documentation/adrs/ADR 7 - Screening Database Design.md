# ADR 7: Screening Database Design 
_Author: Taliya Weinstein (1386891)_

## Date: 
16 June 2021


## Status: 
Accepted

## Context: 
Due to the need for the functionality of having a member of a group only be able to accept an in-person meeting request if the user has passed a COVID screening test - it is important to be able to capture the user responses to the COVID screening and store whether or not the user passed the COVID screening.

## Decision:
We will design a screening database raltion table consisting of 4 attributes:
1. screening_id - an integer identity
2. user_id - an interger identity 
3. passed - a boolean in the corresponding T-SQL equivalent bit, set based on the [Wits COVID screening form](https://www.wits.ac.za/covid19/covid19-screening-tool/)
4. date_screened - datetimeoffset

We will use screening_id as the primary key for this table since it is the only attribute which is able to uniquely identify any row.

We will set user_id to be a foreign key which references the [users table](https://github.com/witseie-elen4010/2021-008-project/blob/main/documentation/adrs/ADR%203-%20User%20Database%20Design.md) in order to link the COVID-screening event to a specific user of the web application. 

We will not allow any attribute to be null to ensure the user's information, the result of the screening and the date of the screening are all recorded as all 3 are pertinent to the decision of whether a specific user can attend an in-person meeting. This screening event also represents a key health and safety aspect of our web application and thus has an imperative to capture all required data fields. 

## Consequences:
1. The table is designed in 3rd normal form covering one business concept thus thus enabling the elimination of redundant data , improves data quality and enables anomoly elimination for update,insert and delete.
2. Reduced redundant data [improves overall performance.](https://www.educba.com/third-normal-form/)
3. The decision to enable a user to attend a meeting can be assessed both on the passed attribute as well as the date_screened which enables a better screening since COVID screening results are generally only valid for [72 hours](https://www.gov.za/covid-19/models/current-alert-provincemetro). This ensures increaed health protection of the web application's users. 


