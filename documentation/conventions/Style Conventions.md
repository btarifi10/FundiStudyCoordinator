## Style Conventions
ELEN4010 - Software Development III
Group Laboratory: Team 8

---

### JavaScript

#### Linting

The style formatting of any JavaScript code will be automated using the [StandardJS](https://standardjs.com/) linter. A comprehensive list of the conventions enforced by this linter can be found [here](https://standardjs.com/rules.html). Additionally, the `'use strict'` directive must be present at the beginning of each new file so that the compiler can prevent bad practices such as making use of undeclared variables.

#### Naming Conventions

In general, names should be concise and easy to understand such that the purpose of your code is made clear. Avoid purely symbolic names such as `x1` as well as overly verbose ones containing an entire sentence. Functions and variables are named using `camelCase`, while constants make use of UPPERCASE with underscores to separate words, such as `MAX_LENGTH`. Files are named using lowercase letters with hyphens to separate words, such as `hello-world.js`.

Regular variables should be nouns/noun phrases, while functions should be verb/verb phrases. Booleans should be named such that they read well in conditional structures such as `if` statements, as well as `for` and `while` loops, such as `isRegistered`.

#### Nesting and Line Length

Code should be limited to 2-3 layers of nesting. Going beyond this is an indication that some form of refactoring needs to take place, such as using functions to encapsulate certain tasks. It is better to have code that extends vertically rather than horizontally, with line lengths below 80 characters to improve readability. Lines that extend beyond this should be broken after an operator or comma.

A vertical ruler can be inserted into VSCode by adding the following property to the `settings.json` file.

```json
"editor.rulers": [
        80
    ]
```

#### Functions

Functions should be used to modularize your code, making it easier to read and alter. They should be short and fullfil a single purpose.

#### Comments

Comments should be used to make the code easier to read and understand. However, they should *enhance* the user's understanding, rather than compensating for non-intuitive code. In general, this means explaining "why" certain things are done and not "how" or "what" is done (this should be clear from the code itself). In other words, comments should be used to provide information that is not inherently obvious from the code. However, this is only a general rule, and comments can also be used to summarize the overall function of a region of code to give the file structure and make it easier to read.

### SQL

The best practices and conventions for SQL followed throughout this project can be found [here](https://data36.com/sql-best-practices-data-analysts/).

### Testing

Indivudual functions that execute low-level business logic should be tested using [Jest](https://jestjs.io/) unit tests while following the best practices given [here](https://yonigoldberg.medium.com/yoni-goldberg-javascript-nodejs-testing-best-practices-2b98924c9347).

The testing of [CRUD](https://www.codecademy.com/articles/what-is-crud) (Create, Read, Update and Delete) functionality should be done using End-to-End [Cypress](https://www.cypress.io/) tests. To avoid polluting the production database, tests should be run on a seperate database (see README). The best practices that should be followed to avoid flakey tests can be found [here](https://docs.cypress.io/guides/references/best-practices).

### Architecture Design Records (ADR)

Architecture Design Records are used to document important decisions that affect the architecture of the project, such as dependencies, frameworks, interfaces, APIs, stack layout etc.

Each decision will be recorded in a short, lightweight text file formatted using Markdown and numbered sequentially and monotonically (numbering such as 1.2 or 10.0.2 will _not_ be used). If certain decisions are overridden at a later date, a new ADR is created and the old one is marked as _deprecated_ under the "status" section - it is _not_ overwritten. The document should be short (1 to 2 pages) and written using clear, full sentences; as if you were explaining the decision to a new developer.

The format for each ADR is as follows: (taken from Michael Nygard's [article](https://cognitect.com/blog/2011/11/15/documenting-architecture-decisions) on ADRs)


> **Title** - These documents have names that are short noun phrases. For example, "ADR 1: Deployment on Ruby on Rails 3.0.10" or "ADR 9: LDAP for Multitenant Integration"
> 
> **Context** - This section describes the forces at play, including technological, political, social, and project local. These forces are probably in tension, and should be called out as such. The language in this section is value-neutral. It is simply describing facts.
> >
> **Decision** - This section describes our response to these forces. It is stated in full sentences, with active voice. "We will …"
>
> **Status** - A decision may be "proposed" if the project stakeholders haven't agreed with it yet, or "accepted" once it is agreed. If a later ADR changes or reverses a decision, it may be marked as "deprecated" or "superseded" with a reference to its replacement.
> 
> **Consequences** - This section describes the resulting context, after applying the decision. All consequences should be listed here, not just the "positive" ones. A particular decision may have positive, negative, and neutral consequences, but all of them affect the team and project in the future.


---
