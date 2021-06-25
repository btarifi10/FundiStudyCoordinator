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
const moment = require('moment')

describe('Group creation is logged', () => {
  before('Navigate to Create Group Page', () => {
    cy.request('/clear-groups')
    loginAsArchie()
    cy.visit('/create-group')
  })
  it('Creates the group', () => {
    cy.get('input[data-cy="group-name"]')
      .clear()
      .type('NewGroup1')
      .should('have.value', 'NewGroup1')

    cy.get('[data-cy=course-code]')
      .clear()
      .type('TEST123')
      .should('have.value', 'TEST123')

    cy.get('select[data-cy="user-list"]')
      .select('James VI')

    cy.get('[data-cy=add-btn]')
      .click()

    cy.get('select[data-cy="user-list"]')
      .select('barry')

    cy.get('[data-cy=add-btn]')
      .click()

    cy.get('[data-cy=added-users]')
      .find('li')
      .should('have.length', 2)

    cy.get('[data-cy=create-btn]')
      .click()

    cy.on('window:alert', (txt) => {
      expect(txt).to.contains("Group 'NewGroup1' has been created")
    })
    cy.wait(1000)
  })
})

describe('Creator of group is member of group created', () => {
  before('Navigate to Create Group Page', () => {
    loginAsArchie()
    cy.visit('/my-groups')
  })
  it('Shows the group in the action log of the group', () => {
    // acces the group created, and click on activity log to view 'group created'
    cy.get('[data-cy=groups-table]')
      .contains('NewGroup1')
  })
})

describe('James invited to group can view invite', () => {
  before('Navigate to Invites page', () => {
    loginAsJames()
    cy.visit('/invites')
  })

  it('Shows the invites in the table', () => {
    cy.get('[data-cy=invite-table]')
      .contains('NewGroup1')
  })
})

describe('barry invited to group can view invite', () => {
  before('Navigate to Invites page', () => {
    loginAsBarry()
    cy.visit('/invites')
  })

  it('Shows the invites in the table', () => {
    cy.get('[data-cy=invite-table]')
      .contains('NewGroup1')
  })
})

describe('Create events to be logged in a group chat', () => {
  before('Enter a Group chat', () => {
    loginAsArchie()
    cy.visit('/chat?group=Scotland')
  })
  it('Type a message in a group chat', () => {
    cy.get('form')
    cy.get('[data-cy=message-input]')
      .type('My first message')
      .should('have.focus')

    cy.get('[data-cy=send-button]').click()

    cy.get('[data-cy="message-area"]')
      .find('.message')
      .should('have.length', 1)
      .and('include.text', 'Archie')
      .and('include.text', `${moment().format('HH:mm')}`)
      .and('include.text', 'My first message')
  })
  it('Allows user to leave the group chat', () => {
    cy.visit('/my-groups')
  })
  // it('Allows user to create a poll', () => {

  // })
  // it('Allows user to create a meeting', () => {

  // })
})

describe('Activity log of a group shows activities', () => {

})

// describe('Messages sent in a group chat are logged', () => {})

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

function loginAsBarry () {
  cy.visit('/')

  cy.get('[data-cy=sign-in-homepage]').click()

  cy.get('form')

  cy.get('[data-cy=username]')
    .type('barry')
    .should('have.value', 'barry')

  cy.get('[data-cy=password]')
    .type('flash')
    .should('have.value', 'flash')

  cy.get('[data-cy=sign-in-login]')
    .click()
}
