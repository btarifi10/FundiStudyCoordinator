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
const moment = require('moment')

describe('The correct page is displayed to the user when entering the Join-group page', () => {
  before('Navigate to Find-Groups page', () => {
    cy.request('/clear-requests')
    cy.request('/clear-groups')
    cy.wait(10000)
    loginAsBarry()
    cy.visit('/find-groups')
    cy.wait(3000)
  })
  beforeEach('Stay signed in', () => {
    Cypress.Cookies.preserveOnce('connect.sid')
  })

  it('Displays the join-group page', () => {
    cy.get('[data-cy="groups-table"]')
      .contains('Scotland')

    cy.get('[data-cy="groups-table"]')
      .contains('UNICORN007')
  })
})

describe('User can search for groups', () => {
  it('User can find group that they are not a member of', () => {
    cy.get('[data-cy=group-search]')
      .clear()
      .type('Scot')

    cy.get('[data-cy=groups-table]')
      .contains('Scotland')
  })

  it('User cannot find groups that do not exist', () => {
    cy.get('[data-cy=group-search]')
      .clear()
      .type('Batman')

    cy.get('[data-cy=groups-table]')
      .contains('No Matching Groups')
  })
})

describe('User cannot join groups they are a member of', () => {
  it('Does not display any groups the user is a member of', () => {
    cy.get('[data-cy=group-search]')
      .clear()

    cy.get('[data-cy="groups-table"]')
      .find('tr')
      .should('have.length', 2) // The titles and Scotland found in previous 'it'
  })
})

describe('User can join groups that they are not members of', () => {
  it('Allows user to click on the join button for a group once and then the group disappears', () => {
    cy.get('[data-cy=join-btn]')
      .click()

    cy.on('window:alert', (txt) => {
      expect(txt).to.contains("A Request to join 'Scotland' has been sent")
    })

    cy.get('[data-cy="groups-table"]')
      .contains('No Matching Groups')

    cy.request('/clear-requests')
    cy.request('/clear-groups')
  })
})

/* ---------------------------- Helper Functions ---------------------------- */

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
  cy.wait(3000)
}
