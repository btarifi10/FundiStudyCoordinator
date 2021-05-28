# Git and Code Review Conventions
ELEN4010 - Software Development III
Group Laboratory: Team 8

---

## Git

### Workflow

A trunk based development (TBD) workflow will be used, with short-lived single-developer branches. These branches will be created at the beginning of every sprint, merged into `main` at the end of the sprint, and deleted. A branch will be used for a single feature or multiple closely related features, and a developer may use multiple branches in a single sprint if they are working on multiple unrelated features.

### Git Commit Conventions

The following convention will be used when making commits during a sprint:

    <type>(<scope>): <subject>

    <longer description and comments>

    <issue reference>

`type` refers to the type of commit and can be one of the following:
- build: Build related changes (eg: npm related/ adding external dependencies)
- chore: A code change that external user won't see (eg: change to .gitignore file)
- feat: A new feature
- fix: A bug fix
- docs: Documentation related changes
- refactor: A code that neither fixes a bug nor adds a feature. (eg: You can use this when there is semantic changes like renaming a variable/ function name)
- perf: A code that improves performance
style: A code that is related to styling
- test: Adding new test or making changes to existing test

`scope` is optional and is a noun which refers to the section of the codebase the commit changes

`subject` is a short summary of the commit, explaining what was changed and why. This should generally be less than 50 characters, and not start with a capital letter or end with punctuation. Furthemore, it should use the imperative form of verbs.

`longer description and comments` is optional, and follows an empty line if used. It may be used to provide additional context or information.

`issue reference` is optional, and follows an empty line if used. This may be used to reference GitHub issues affected by the commit.

These conventions were found on multiple websites, such as the example shown [here](https://dev.to/i5han3/git-commit-message-convention-that-you-can-follow-1709).

### Pull Request Conventions

The following pull request conventions are used:

- Good commit messages (see above)
- Small pull requests which allow for faster code review and acceptance
- Useful descriptions and titles
- Summary of what commits and groups of commits accomplish
- Rebase small commits which are just to fix mistakes and do not contribute to the story being told by commits

## Code Review Conventions

#### _Method_
Two methods will be used depending on circumstance, availability of group members, and code to be reviews:
- Synchronous: The developer will share their screen during an online meeting, or use a collaborative coding tool such the one provided by VS Code. The developer will then walk the reviewer through the code, with the reviewer making notes and providing feedback simultaneously.
- Asynchronous: The pull request is made and the reviewer reviews the code and makes comments, which the developer fixes on their own time.

#### _Duration and size of code_
The code review should be time-boxed to about 1 hour and limited to roughly 400 lines of code at a time. If more time is necessary, a break should be taken or the developer should revisit the code.

#### _Code correction_
If both developer and reviewer are looking at it together, small things will be fixed on the go since it may be difficult to find again, while commenting on the process Larger problems may need to actually be looked at by the developer again after guidance from the reviewer.

#### _General things to look out for_
- Design: Is the code well-designed and appropriate for your system?
- Functionality: Does the code behave as the author likely intended? Is the way the code behaves good for its users?
- Complexity: Could the code be made simpler? Would another developer be able to easily understand and use this code when they come across it in the future?
- Tests: Does the code have correct and well-designed automated tests?
- Naming: Did the developer choose clear names for variables, classes, methods, etc.?
- Comments: Are the comments clear and useful?
- Style: Does the code follow the style conventions as set out in the [Style Conventions](Style%20Conventions.md) document?
- Documentation: Did the developer also update relevant documentation, including the _architectural design records_?

These general conventions and practices were found via multiple online resources, mostly drawing from [Google's documentation on code review practices](https://google.github.io/eng-practices/review/).




