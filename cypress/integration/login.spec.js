describe('Login test with new registration and successive login and log out', () => {
  it.skip('Fill register form', () => {
    cy.visit('register')
    cy.get('form')

    cy.get('input[name="username"]')
      .type('btarifi10')
      .should('have.value', 'btarifi10')

    cy.get('input[name="password"]')
      .type('sheesh')
      .should('have.value', 'sheesh')

    cy.get('form').submit()

    cy.url().should('eq', Cypress.config().baseUrl + 'login')
  })

  it.skip('Login as created user', () => {
    cy.visit('login')
    cy.get('form')

    cy.get('input[name="username"]')
      .type('btarifi10')
      .should('have.value', 'btarifi10')

    cy.get('input[name="password"]')
      .type('sheesh')
      .should('have.value', 'sheesh')

    cy.get('form').submit()

    cy.url().should('eq', Cypress.config().baseUrl + 'dashboard')

    cy.request('GET', 'api/currentUser').its('body').then((body) => expect(body).property('username').to.equal('btarifi10'))
  })

  it.skip('Log out', () => {
    cy.get('form')

    cy.get('form').submit()

    cy.url().should('eq', Cypress.config().baseUrl)
  })

  it.skip('Incorrect password redirects back to login page', () => {
    cy.visit('login')
    cy.get('form')

    cy.get('input[name="username"]')
      .type('btarifi10')
      .should('have.value', 'btarifi10')

    cy.get('input[name="password"]')
      .type('shsh')
      .should('have.value', 'shsh')

    cy.get('form').submit()

    cy.url().should('eq', Cypress.config().baseUrl + 'login')
  })
})

describe('Multiple registered users', () => {
  it.skip('A second unique user can be registered', () => {
    cy.visit('register')
    cy.get('form')

    cy.get('input[name="username"]')
      .type('hazey')
      .should('have.value', 'hazey')

    cy.get('input[name="password"]')
      .type('yaze')
      .should('have.value', 'yaze')

    cy.get('form').submit()

    cy.url().should('eq', Cypress.config().baseUrl + 'login')
  })

  it.skip('An existing user cannot be registered', () => {
    cy.visit('register')
    cy.get('form')

    cy.get('input[name="username"]')
      .type('hazey')
      .should('have.value', 'hazey')

    cy.get('input[name="password"]')
      .type('yaze')
      .should('have.value', 'yaze')

    cy.get('form').submit()

    cy.url().should('eq', Cypress.config().baseUrl + 'register')
  })

  it.skip('The second user can also log in', () => {
    cy.visit('login')
    cy.get('form')

    cy.get('input[name="username"]')
      .type('hazey')
      .should('have.value', 'hazey')

    cy.get('input[name="password"]')
      .type('yaze')
      .should('have.value', 'yaze')

    cy.get('form').submit()

    cy.url().should('eq', Cypress.config().baseUrl + 'dashboard')
  })
})

describe('Access to pages based on authentication', () => {
  it.skip('Unauthenticated user cannot access dashboard', () => {
    cy.visit('dashboard')

    cy.url().should('eq', Cypress.config().baseUrl)
  })

  it.skip('Authenticated user cannot access login page', () => {
    cy.visit('login')

    cy.get('input[name="username"]')
      .type('btarifi10')
      .should('have.value', 'btarifi10')

    cy.get('input[name="password"]')
      .type('sheesh')
      .should('have.value', 'sheesh')

    cy.get('form').submit()

    cy.url().should('eq', Cypress.config().baseUrl + 'dashboard')

    cy.visit('login')

    cy.url().should('eq', Cypress.config().baseUrl + 'dashboard')
  })
  it.skip('Authenticated user cannot access register page', () => {
    cy.visit('register')

    cy.url().should('eq', Cypress.config().baseUrl + 'dashboard')
  })
})
