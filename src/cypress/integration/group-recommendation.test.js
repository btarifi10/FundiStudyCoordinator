
/* ----------------------- LOCAL TESTING INSTRUCTIONS --------------------------

Steps:

1) Open a terminal in the project's root directory
2) Run 'npm run dev' (this starts a local server at localhost:3000)
3) Open another terminal in the same directory
4) Run 'npm run e2e' (this starts the Cypress test environment)
5) Click on the file named 'group-recommendation.test.js'
6) This should open up a browser and run the tests below

NOTE: You will have needed to have installed all dependencies (including
developer dependencies)

----------------------------------------------------------------------------- */

describe('Displays the Recommended Groups Page ', () => {
  before(() => {
    login('Sheep', 'wool')
    Cypress.Cookies.preserveOnce('connect.sid')
  })

  it('Routes to Recommended Groups when Side Bar Option is Clicked', () => {
    cy.get('[data-cy=recommended-groups]').click()
    cy.contains('Recommended Groups')
    cy.contains('Group')
  })
})

/* ----------------------------------------------------------------------------- */
describe('Displays Recommended Groups Correctly ', () => {
  beforeEach(() => {
    cy.request('POST', '/logout')
    login('Sheep', 'wool')
    Cypress.Cookies.preserveOnce('connect.sid')
    // cy.get('[data-cy=recommended-groups]').click()
    cy.visit('/recommended-groups')
    cy.wait(2000)
  })

  it('Displays All Recommended Groups With Matching Tags ', () => {
    cy.wait(3000)
    cy.get('[data-cy="groups-table"]').contains('Hall 30')

    cy.get('[data-cy="groups-table"]')
      .find('tr')
      .should('have.length', 2)
  })

  it('Displays the list used to derive the recommendations ', () => {
    cy.wait(3000)
    cy.get('[data-cy="tag-list"]').contains('Recommendations Based On Tags')
    cy.get('[data-cy="tag-list"]').contains('Political Science')
  })
})

/* ----------------------------------------------------------------------------- */
describe('Newly registered User should have No Recommended Groups ', () => {
  before(() => {
    cy.request('POST', '/logout')
    registerAndLogIn()
    Cypress.Cookies.preserveOnce('connect.sid')
    cy.visit('/recommended-groups')
    cy.wait(2000)
  })

  it('Displays No Recommeneded Groups ', () => {
    cy.wait(3000)

    cy.get('[data-cy="groups-table"]')
      .find('tr')
      .should('have.length', 2)

    cy.get('[data-cy=groups-table]')
      .contains('No Matching Groups')

    fetch('/delete-new-user')
  })

  it('Displays the list used to derive the recommendations ', () => {
    cy.wait(3000)
    cy.get('[data-cy="tag-list"]').contains('No Recommendations Generated As No Tags Found')
  })
})

/* ----------------------------------------------------------------------------- */

describe('User can join a recommended group', () => {
  before(() => {
    cy.request('POST', '/logout')
    login('barry', 'flash')
    Cypress.Cookies.preserveOnce('connect.sid')
    cy.visit('/recommended-groups')
    cy.wait(2000)
  })

  it('Allows user to click on the join button for a recommended group ', () => {
    fetch('/clear-Scotland-request')
    cy.wait(2000)
    cy.reload()
    cy.wait(1000)

    cy.get('[data-cy=join-btn]')
      .click()

    cy.on('window:alert', (txt) => {
      expect(txt).to.contains('A Request to join Scotland has been sent')
    })
  })

  it('Recommended group is no longer displayed after a request to join has been sent ', () => {
    cy.get('[data-cy=groups-table]')
      .contains('No Matching Groups')

    cy.get('[data-cy="groups-table"]')
      .find('tr')
      .should('have.length', 2)

    fetch('/clear-Scotland-request')
    cy.wait(2000)
  })
})

/* ---------------------------- Helper Functions ---------------------------- */

function login (userName, password) {
  cy.visit('/')

  cy.get('[data-cy=sign-in-homepage]').click()

  cy.get('form')

  cy.get('[data-cy=username]')
    .type(userName)
    .should('have.value', userName)

  cy.get('[data-cy=password]')
    .type(password)
    .should('have.value', password)

  cy.get('[data-cy=sign-in-login]')
    .click()
}

function registerAndLogIn () {
  cy.visit('register')
  cy.get('form')

  cy.get('[data-cy=firstName]')
    .type('Sasha')
    .should('have.value', 'Sasha')

  cy.get('[data-cy=lastName]')
    .type('Fierce')
    .should('have.value', 'Fierce')

  cy.get('[data-cy=username]')
    .type('Beyonce')
    .should('have.value', 'Beyonce')

  cy.get('[data-cy=password]')
    .type('QueenBee')
    .should('have.value', 'QueenBee')

  cy.get('form').submit()

  cy.wait(2000)

  cy.get('form')
  login('Beyonce', 'QueenBee')
}
