/* -------------------------- TESTING INSTRUCTIONS -----------------------------

Steps:

1) Open a terminal in the project's root directory
2) Run 'npm run dev' (this starts a local server at localhost:3000)
3) Open another terminal in the same directory
4) Run 'npm run e2e' (this starts the Cypress test environment)
5) Click on the file named 'covid_screening.test.js'
6) This should open up a browser and run the tests below

NOTE: You will have needed to have installed all dependencies (including
developer dependencies)

----------------------------------------------------------------------------- */

describe('Covid Screening Can Be Loaded Correctly ', () => {
  before('Navigate to the chat page', getToChatPage)

  it('Routes to Covid Screening When Button Selected', () => {
    cy.get('[data-cy = covid-screening-option]').click()
    cy.contains('University Screening Regulations')
    cy.contains('Are you suffering')
    cy.contains('diarrhoea')
  })

  it('Has both the yes and no options loaded for Form options ', () => {
    cy.get('[data-cy=SymptomsQ1]')
      .should('have.text', '\n            Yes\n            No\n          ')

    cy.get('[data-cy=SymptomsQ2]')
      .should('have.text', '\n            Yes\n            No\n          ')

    cy.get('[data-cy=ContactQ1]')
      .should('have.text', '\n            Yes\n            No\n          ')

    cy.get('[data-cy=ContactQ2]')
      .should('have.text', '\n            Yes\n            No\n          ')

    cy.get('[data-cy=ContactQ3]')
      .should('have.text', '\n          Yes\n          No\n          ')

    cy.get('[data-cy=ContactQ4]')
      .should('have.text', '\n          Yes\n          No\n          ')
  })
})

describe('Options can be correctly selected ', () => {
  beforeEach(() => {
    getToChatPage()
    fetch('/delete-screening')
    cy.get('[data-cy = covid-screening-option]').click()
  })

  it('Marks fail options correctly', () => {
    cy.get('[data-cy=SymptomsQ1]').select('no')
      .should('have.value', 'no')

    cy.get('[data-cy=SymptomsQ2]').select('yes')
      .should('have.value', 'yes')

    cy.get('[data-cy=ContactQ1]').select('yes')
      .should('have.value', 'yes')

    cy.get('[data-cy=ContactQ2]').select('yes')
      .should('have.value', 'yes')
  })
})

describe('Submit button works as intended ', () => {
  beforeEach(() => {
    getToChatPage()
    cy.get('[data-cy = covid-screening-option]').click()
  })

  it('Correctly displays an alert when a the submit button is pressed', () => {
    const stub = cy.stub()
    cy.on('window:alert', stub)
    cy
      .get('[data-cy = Submit]').click()
      .then(() => {
        expect(stub.getCall(0)).to.be.calledWith('Screening results captured')
      })
  })

  it('Routes back to the Group Chat Page When the Submit Button is Pressed', () => {
    cy.get('[data-cy = Submit]').click()
    cy.contains('Group')
    cy.contains('Members in Chat')
  })
})

function getToChatPage () {
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

  // Navigate to the 'Scotland' group chat
  cy.visit('/chat?group=Scotland')
}
