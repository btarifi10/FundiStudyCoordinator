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
// const moment = require('moment')

describe('The correct page is displayed to the user when entering the create-group page', () => {
  before('Navigate to Create-Group page', () => {
    // Sign in
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

    cy.visit('/create-group')
  })

  it('Displays the create-group page', () => {
    cy.get('[data-cy=group-name]')
      .should('have.text', '')

    cy.get('[data-cy=course-code]')
      .should('have.text', '')

    cy.get('select[data-cy="user-list"]')
      .find('option')
      .should('have.length', 2)
  })
})

describe('Users cannot input invalid group information for group creation', () => {
  before('Clear any groups besides default group_id = 6', () => {
    fetch('/clear-groups')
  })
  it('Does not allow user to create group without inviting a member', () => {
    cy.get('input[data-cy="group-name"]')
      .type('NewGroup1')
      .should('have.value', 'NewGroup1')

    cy.get('[data-cy=course-code]')
      .type('TEST123')
      .should('have.value', 'TEST123')

    cy.get('[data-cy=create-btn]')
      .click()

    cy.on('window:alert', (txt) => {
      expect(txt).to.contains('Please select at least one member')
    })
  })

  it('Filters through the user list upon user input', () => {
    cy.get('input[data-cy="user-search"]')
      .clear()
      .type('B')

    cy.get('select[data-cy="user-list"]')
      .find('option')
      .should('have.length', 1)
      .and('have.text', 'barry')

    cy.get('input[data-cy="user-search"]')
      .clear()
      .type('flowers')

    cy.get('select[data-cy="user-list"]')
      .find('option')
      .should('have.length', 0)
  })

  it('Lists members invited', () => {
    cy.get('input[data-cy="user-search"]')
      .clear()

    cy.get('select[data-cy="user-list"]')
      .select('James VI')

    cy.get('[data-cy=add-btn]')
      .click()

    cy.get('[data-cy=added-users]')
      .find('li')
      .should('have.length', 1)
      .and('have.text', 'James VI')

    cy.get('select[data-cy="user-list"]')
      .not('have.text', 'James VI')
  })

  it('Does not allow user to invite same user twice', () => {
    cy.get('input[data-cy="user-search"]')
      .type('James')

    cy.get('select[data-cy="user-list"]')
      .should('have.length', 1)
      .and('have.text', '')
  })
  /// //////////////////////////////////////////////////////////////////////////////////////////////////////
  it('Does not allow user to input empty group name', () => {
    cy.get('input[data-cy="group-name"]')
      .clear()
      .should('have.value', '')

    cy.get('[data-cy=course-code]')
      .clear()
      .type('TEST123')
      .should('have.value', 'TEST123')

    cy.get('[data-cy=create-btn]')
      .click()

    cy.on('window:alert', (txt) => {
      expect(txt).to.contains('Please enter a valid group name')
    })
  })

  it('Does not allow user to input group name over 40 alphanumerics', () => {
    cy.get('input[data-cy="group-name"]')
      .clear()
      .type('12345678901234567890123456789012345678907654321')
      .should('have.value', '1234567890123456789012345678901234567890')
  })

  it('Does not allow user to input course code over 10 alphanumerics', () => {
    cy.get('input[data-cy="course-code"]')
      .clear()
      .type('abcd5678901')
      .should('have.value', 'abcd567890')
  })
  /// //////////////////////////////////////////////////////////////////////////////////////////////////////
})

describe('User can create a new group with chosen members invited (automatically added for now)', () => {
  before('Clear any groups besides default group_id = 6', () => {
    cy.request('/clear-groups')
  })
  it('Allows user to input Group information and add member to invite to create a new group', () => {
    cy.get('input[data-cy="group-name"]')
      .clear()
      .type('NewGroup1')
      .should('have.value', 'NewGroup1')

    cy.get('[data-cy=course-code]')
      .clear()
      .type('TEST123')
      .should('have.value', 'TEST123')

    cy.get('[data-cy=create-btn]')
      .click()

    cy.on('window:alert', (txt) => {
      expect(txt).to.contains("Group 'NewGroup1' has been created")
    })
  })

  it('Clears the group information form when group is created successfully', () => {
    cy.get('[data-cy=group-name]')
      .should('have.text', '')

    cy.get('[data-cy=course-code]')
      .should('have.text', '')

    cy.get('[data-cy=user-list]')
      .contains('James VI')

    cy.get('[data-cy=user-list]')
      .contains('barry')
  })

  // it('Sends invite to added user on group creation', () => {})

  it('Cannot create the same group again', () => {
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

    cy.get('[data-cy=create-btn]')
      .click()

    cy.on('window:alert', (txt) => {
      expect(txt).to.contains('This group already exists')
    })
  })
})
