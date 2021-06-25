/* eslint-env jest */

/* -------------------------- TESTING INSTRUCTIONS -----------------------------
Steps:
1) Open a terminal in the project's root directory
2) Run 'npm run dev' (this starts a local server at localhost:3000)
3) Open another terminal in the same directory
4) Run 'npm run e2e' (this starts the Cypress test environment)
5) Click on the file named 'create-join-group.test.js'
6) This should open up a browser and run the tests below

NOTE: You will have needed to have installed all dependencies (including
developer dependencies)
----------------------------------------------------------------------------- */
/* Permanent data in database
User 1:
user_id = 4
first_name = 'Archibald'
last_name = 'Armstrong'
username = 'Archie'
user_password = sh33p123

User 2:
user_id = 5
first_name = 'James'
last_name = 'Stuart'
username = 'James VI'
user_password = longlivetheking

User 3: barry
user_id = 28

Group 2: Hall 30
group_id: 29

Group 1:
group_id = 6
group_name = 'Scotland'
course_code = 'UNICORN007'
(NOTE: Both User 1 and User 2 are part of this group)
*/
describe('Group creation is logged', () => {
    before('Navigate to Create Group Page')
})

describe('Invites upon group creation are logged', () => {})

describe('Entering and Leaving a group chat is logged', () => {})

describe('Messages sent in a group chat are logged', () => {})

describe('COVID screening results are logged', () => {})





/* ---------------------------- Helper Functions ---------------------------- */

function loginAsArchie () {
  cy.visit('/')

  cy.get('[data-cy=sign-in-homepage]').click()

  cy.get('form')

  cy.get('[data-cy=username]')
    .type('Archie')
    .should('have.value', 'Archie')

  cy.get('[data-cy=password]')
    .type('sh33p123')
    .should('have.value', 'sh33p123')

  cy.get('[data-cy=sign-in-login]')
    .click()
}

function loginAsJames () {
  cy.visit('/')

  cy.get('[data-cy=sign-in-homepage]').click()

  cy.get('form')

  cy.get('[data-cy=username]')
    .type('James VI')
    .should('have.value', 'James VI')

  cy.get('[data-cy=password]')
    .type('longlivetheking')
    .should('have.value', 'longlivetheking')

  cy.get('[data-cy=sign-in-login]')
    .click()
}
