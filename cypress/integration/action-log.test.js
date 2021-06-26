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

describe('Create activities to be logged', () => {
  before('Navigate to Create Group Page', () => {
    cy.request('/clear-groups')
    loginAsArchie()
    cy.visit('/create-group')
  })
  beforeEach('Stay signed in', () => {
    Cypress.Cookies.preserveOnce('connect.sid')
  })
  it('Creates the group, and invite two members', () => {
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
  it('Allows user to take COVID screening', () => {
    cy.visit('/chat?group=NewGroup1')

    cy.wait(2000)

    cy.get('[data-cy=covid-screening-option]')
      .click()

    cy.get('[data-cy=Submit]')
      .click()
  })

  it('Enters group chat and writes a message', () => {
    cy.visit('/chat?group=NewGroup1')
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

    cy.wait(2000)
  })

  it('Allows user to create a meeting', () => {
    cy.visit('/choose-location?group=NewGroup1')
    cy.get('[data-cy=meeting-form]').within(() => {
      cy.get('[data-cy=date-input]')
        .type('2022-03-13T16:20')
        .should('have.value', '2022-03-13T16:20')

      cy.get('[data-cy=method-input]')
        .select('online')
        .should('have.value', 'online')

      cy.get('[data-cy=platform-input]')
        .type('Discord')
        .should('have.value', 'Discord')

      cy.get('[data-cy=link-input]')
        .type('https://discord.com/')
        .should('have.value', 'https://discord.com/')

      cy.get('[data-cy=create-meeting]').click()

      cy.on('window:alert', (message) => {
        expect(message).to.contains('You have successfully created a Meeting')
      })
    })
    cy.wait(2000)
  })
})

describe('Activity log of a group shows activities', () => {
  before('Enter a Group chat', () => {
    // loginAsArchie()
    cy.visit('/chat?group=NewGroup1')
    cy.get('[data-cy=view-log]')
      .click()

    cy.wait(2000)
  })
  it('Shows actions created in activity log', () => {
    cy.get('[data-cy=log-entries]')
      .contains("'NewGroup1' was created")

    cy.get('[data-cy=log-entries]')
      .contains("Members invited to join 'NewGroup1': James VI, barry,")

    cy.get('[data-cy=log-entries]')
      .contains("Archie entered the 'NewGroup1' chat")

    cy.get('[data-cy=log-entries]')
      .contains("Archie left the 'NewGroup1' chat")

    cy.get('[data-cy=log-entries]')
      .contains('"My first message"')

    cy.get('[data-cy=log-entries]')
      .contains('Archie has failed their COVID screening')

    cy.get('[data-cy=log-entries]')
      .contains("online meeting for 'NewGroup1' has been set")
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

  it('Remove any creations in database (for test consistency)', () => {
    cy.request('/clear-groups')
  })
})

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
