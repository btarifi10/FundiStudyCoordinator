/* ----------------------- LOCAL TESTING INSTRUCTIONS --------------------------

Steps:

1) Open a terminal in the project's root directory
2) Run 'npm run dev' (this starts a local server at localhost:3000)
3) Open another terminal in the same directory
4) Run 'npm run e2e' (this starts the Cypress test environment)
5) Click on the file named 'rating.test.js'
6) This should open up a browser and run the tests below

NOTE: You will have needed to have installed all dependencies (including
developer dependencies)

----------------------------------------------------------------------------- */

describe('Routes correctly to the Rating Page ', () => {
  beforeEach(() => {
    fetch('/reset-ratings')
    login()
    cy.visit('/chat?group=Scotland')
    cy.get('[data-cy = rating-option]').click()
  })

  it('Loads Text Correctly', () => {
    cy.contains('Rate Members In the Group')
    cy.contains('Select member to rate')
    cy.contains('Provide a ranking from 0 to 5')
  })

  it('Contains 6 rating options', () => {
    cy.contains('0')
    cy.contains('1')
    cy.contains('2')
    cy.contains('3')
    cy.contains('4')
    cy.contains('5')
  })

  it('Possible members are loaded correctly', () => {
    cy.get('[data-cy = user-selection]')
      .find('option')
      .should('have.length', 1)
      .and('have.text', 'James VI (null)')
  })
})

describe('My Rating is Correctly loaded on my Profile', () => {
  beforeEach(() => {
    login()
    cy.visit('/profile')
    fetch('/reset-ratings')
  })

  it('Loads Rating Correctly', () => {
    cy.contains('Rating')
    cy.contains('5')
  })
})

/* -------------------------------------------------------------------------- */

describe('Rating Functionality Works As Expected ', () => {
  it('Able to input a rating for a null rated user ', () => {
    login()
    fetch('/reset-ratings')
    cy.visit('/chat?group=Scotland')
    cy.get('[data-cy = rating-option]').click()
    cy.get('[data-cy = user-selection]').select('James VI').should('have.value', 'James VI').and('have.text', 'James VI (null)')
    cy.get('[type="radio"]').check('2').should('have.value', '2')
    cy.get('[data-cy = Submit]').click()
    cy.wait(1000)
    cy.reload()
  })

  it('Rating given for previously null user is displayed correctly when page has been reloaded ', () => {
    cy.get('[data-cy = user-selection]')
      .select('James VI')
      .should('have.text', 'James VI (2)')
  })

  it('Rating a member gives the correct result for a user with a previous rating ', () => {
    login()
    fetch('/reset-ratings')
    cy.visit('/chat?group=Hall 30')
    cy.get('[data-cy = rating-option]').click()
    cy.get('[data-cy = user-selection]').select('barry').should('have.value', 'barry')
    cy.get('[type="radio"]').check('5').should('have.value', '5')
    cy.get('[data-cy = Submit]').click()
    cy.wait(1000)
    cy.reload()
    // Value of 4 comes from (previous rating * number of ratings + new rating) / (number of ratings+1)
    cy.get('[data-cy = user-selection]')
      .select('barry')
      .should('have.text', 'barry (4)')
  })
})

/* -------------------------------------------------------------------------- */

describe('Submit button works as intended ', () => {
  before(() => {
    login()
    cy.visit('/chat?group=Scotland')
  })

  it('Correctly displays an alert when a the submit button is pressed', () => {
    cy.get('[data-cy = rating-option]').click()
    const stub = cy.stub()
    cy.on('window:alert', stub)
    cy
      .get('[data-cy = Submit]').click()
      .then(() => {
        expect(stub.getCall(0)).to.be.calledWith('Rating Captured')
      })
  })
})

/* ---------------------------- Helper Functions ---------------------------- */

function login () {
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

function getScotlandRating () {
  cy.request('POST', '/logout')
  login()
  cy.visit('/chat?group=Scotland')
  cy.get('[data-cy = rating-option]').click()
}
