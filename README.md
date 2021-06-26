# Study Group Coordinator 

[![Build Status](https://travis-ci.com/witseie-elen4010/2021-008-project.svg?token=V5cp52PcqVwRJucANpvU&branch=main)](https://travis-ci.com/witseie-elen4010/2021-008-project) [![Coverage Status](https://coveralls.io/repos/github/witseie-elen4010/2021-008-project/badge.svg?t=Oi7CiE)](https://coveralls.io/github/witseie-elen4010/2021-008-project)

## Current release: v3.0

ELEN4010 - Group 8 

Nathan Jones (1619191), Yasser Karam (1624228), Tarryn Maggs (719597), Basheq Tarifi (1696842), Taliya Weinstein (1386891)

_Note that_ `dummy.txt` _is just an empty placeholder document to maintain the desired directory structure on GitHub_

## Database details
The database(s) for the project are located at the server team8.database.windows.net.

Environment variables are used for storing the database details and credentials. These are as follows:
- Username (environment variable `DB_USER`): `Team08` 
- Password (environment variable `DB_PASSWORD`): `Sh33p123`
- Production database (environment variable `DB_NAME`): `StudyGroupCoordinator`
- Testing database (environment variable `DB_NAME`): `TestDataBase`
- Deployment flag (environment variable `DEPLOYMENT`): `PRODUCTION` or `TEST`

## Test database fixed entries

These are the permanent entries in the test database that should not be altered.

> **NOTE**: The creation of these entries may affect other tables, such as `memberships`, `invites`, `action_log` etc. With this in mind, altering these entries should be explicitly avoided by checking for the id's of the permanent users, groups, etc. Alternatively, one could remove only what was added for testing purposes after each test (this is probably safer). 

### Table: users
| user_id | username |  user_password* |             first_name             | last_name | rating | number_ratings |   address_line_1  |   address_line_2   |        city        | postal_code |
|:-------:|:--------:|:---------------:|:----------------------------------:|:---------:|:------:|:--------------:|:-----------------:|:------------------:|:------------------:|:-----------:|
|    4    |  Archie  |     sh33p123    |              Archibald             | Armstrong |    5   |        1       | 4 Kentucky Circle | Saddlebrook Estate |    Johannesburg    |     1684    |
|    5    | James VI | longlivetheking | 2021-06-25 10:37:16.0110000 +02:00 |   James   |  NULL  |      NULL      |  6 Shelley Street |      Ridgeway      | Johannesburg South |     2091    |
|    28   |   barry  |      flash      |                Barry               |   Allen   |   3.5  |        2       |   6 North Avenue  |       Riviera      |    Johannesburg    |     2193    |
|    34   |   Sheep  |      wool      |                Shaun                |  Shababi  |  NULL  |      NULL      |  Montecasino Blvd |      Fourways      |    Johannesburg    |     2055    |

> \* The passwords are shown in unhashed form

### Table: groups
| group_id | group_name | course_code |            date_created            | tag |
|:--------:|:----------:|:-----------:|:----------------------------------:|:----:|
|     6    |  Scotland  |  UNICORN007 | 2021-06-24 07:20:48.6580000 +02:00 | NULL |
|    29    |   Hall 30  |    HALL30   | 2021-06-25 10:37:16.0110000 +02:00 | NULL |

### Table: memberships
| membership_id | user_id | group_id |             date_joined            |
|:-------------:|:-------:|:--------:|:----------------------------------:|
|       2       |    5    |     6    | 2021-06-24 07:20:48.6580000 +02:00 |
|       3       |    4    |     6    | 2021-06-24 07:34:05.0000000 +02:00 |
|       26      |    28   |    29    | 2021-06-25 10:37:16.0110000 +02:00 |
|       27      |    4    |    29    | 2021-06-25 10:37:46.0000000 +02:00 |
|       47      |    34   |     6    | 2021-06-25 22:03:55.0000000 +02:00 |


### Table: meetings
| meeting_id | group_id | creator_id |            meeting_time            |                       place                       |                                                                                              link                                                                                             | is_online |
|:----------:|:--------:|:----------:|:----------------------------------:|:-------------------------------------------------:|:---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------:|:---------:|
|      2     |     6    |      4     | 2021-07-05 12:00:00.0000000 +02:00 | 1 Jan Smuts Ave, Braamfontein, Johannesburg, 2000 |                                        https://www.google.com/maps/dir/?api=1&destination=1%20Jan%20Smuts%20Ave,%20Braamfontein,%20Johannesburg,%202000                                       |     0     |
|      3     |     6    |      4     | 2021-07-05 12:00:00.0000000 +02:00 |                  Microsoft Teams                  | https://teams.microsoft.com/l/channel/19%3ac28be551715948bd9a244317273785af%40thread.tacv2/General?groupId=2bd99e7b-f2c6-4379-9d52-0bce78942072&tenantId=4b1b908c-5582-4377-ba07-a36d65e34934 |     1     |

### Table: screening
| screening_id | user_id | passed |            date_screened           |
|:------------:|:-------:|:------:|:----------------------------------:|
|      171     |    4    |    1   | 2021-07-26 20:00:00.0000000 +00:00 |
|      172     |    5    |    0   | 2021-07-26 20:00:00.0000000 +00:00 |
