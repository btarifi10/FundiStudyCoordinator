describe('Registration and successive sign in and sign out', () => {
  before('Clear all users except for permanent users', () => {
    fetch('/clear-users')
  })

  it('Registering an existing username produces an error', () => {
    cy.visit('register')
    cy.get('form')

    cy.get('[data-cy=firstName]')
      .type('Archibald')
      .should('have.value', 'Archibald')

    cy.get('[data-cy=lastName]')
      .type('Obediah')
      .should('have.value', 'Obediah')

    cy.get('[data-cy=username]')
      .type('Archie')
      .should('have.value', 'Archie')

    cy.get('[data-cy=password]')
      .type('archthe2')
      .should('have.value', 'archthe2')

    cy.get('form').submit()

    cy.get('[data-cy=reg-alert]').contains('Account with username Archie already exists')

    cy.url().should('eq', Cypress.config().baseUrl + 'register')
  })

  it('Register and log in as a new user successfully', () => {
    cy.visit('register')
    cy.get('form')

    cy.get('[data-cy=firstName]')
      .type('Naruto')
      .should('have.value', 'Naruto')

    cy.get('[data-cy=lastName]')
      .type('Uzumaki')
      .should('have.value', 'Uzumaki')

    cy.get('[data-cy=username]')
      .type('naruto9')
      .should('have.value', 'naruto9')

    cy.get('[data-cy=password]')
      .type('dattebayo')
      .should('have.value', 'dattebayo')

    cy.get('[data-cy=addAddressBtn]').should('have.class', 'btn-secondary')

    cy.get('[data-cy=addAddressBtn]').click().should('have.class', 'btn-danger')

    cy.get('[data-cy=addressLine1]')
      .type('15 Meiring Cres')
      .should('have.value', '15 Meiring Cres')

    cy.get('[data-cy=addressLine2]')
      .type('Rynfield')
      .should('have.value', 'Rynfield')

    cy.get('[data-cy=city]')
      .type('Benoni')
      .should('have.value', 'Benoni')

    cy.get('[data-cy=postalCode]')
      .type('1501')
      .should('have.value', '1501')

    cy.get('form').submit()

    cy.url().should('eq', Cypress.config().baseUrl + 'login')

    cy.get('form')

    cy.get('[data-cy=username]')
      .type('naruto9')
      .should('have.value', 'naruto9')

    cy.get('[data-cy=password]')
      .type('dattebayo')
      .should('have.value', 'dattebayo')

    cy.get('form').submit()

    cy.url().should('eq', Cypress.config().baseUrl + 'dashboard')

    cy.request('GET', 'api/currentUser').its('body').then((body) => {
      expect(body).property('firstName').to.equal('Naruto')
      expect(body).property('lastName').to.equal('Uzumaki')
      expect(body).property('username').to.equal('naruto9')
      expect(body).property('addressLine1').to.equal('15 Meiring Cres')
      expect(body).property('addressLine2').to.equal('Rynfield')
      expect(body).property('city').to.equal('Benoni')
      expect(body).property('postalCode').to.equal('1501')
      expect(body).property('rating').to.equal(null)
    })
  })

  it('Log out', () => {
    cy.get('[data-cy=sign-out-btn]').click()

    cy.url().should('eq', Cypress.config().baseUrl)
  })
})

describe('Invalid and valid sign in attempts are handled', () => {
  beforeEach('Clear all users except for permanent users', () => {
    fetch('/clear-users')
    cy.visit('login')
  })

  it('Correct user with incorrect password displays error message', () => {
    cy.get('form')

    cy.get('[data-cy=username]')
      .type('Archie')
      .should('have.value', 'Archie')

    cy.get('[data-cy=password]')
      .type('sheep123')
      .should('have.value', 'sheep123')

    cy.get('form').submit()

    cy.get('[data-cy=sign-in-alert]').contains('Password Incorrect')
    cy.url().should('eq', Cypress.config().baseUrl + 'login')
  })

  it('Invalid user input displays error message', () => {
    cy.get('form')

    cy.get('[data-cy=username]')
      .type('Archi')
      .should('have.value', 'Archi')

    cy.get('[data-cy=password]')
      .type('sheep123')
      .should('have.value', 'sheep123')

    cy.get('form').submit()

    cy.get('[data-cy=sign-in-alert]').contains('No account created for Archi')
    cy.url().should('eq', Cypress.config().baseUrl + 'login')
  })

  it('Valid username and password combination logs in and logs out', () => {
    cy.get('form')

    cy.get('[data-cy=username]')
      .type('Archie')
      .should('have.value', 'Archie')

    cy.get('[data-cy=password]')
      .type('sh33p123')
      .should('have.value', 'sh33p123')

    cy.get('form').submit()

    cy.url().should('eq', Cypress.config().baseUrl + 'dashboard')

    cy.request('GET', 'api/currentUser').its('body').then((body) => {
      expect(body).property('username').to.equal('Archie')
    })

    cy.get('[data-cy=sign-out-btn]').click()

    cy.url().should('eq', Cypress.config().baseUrl)
  })

  it('A different valid user can log in and log out', () => {
    cy.get('form')

    cy.get('[data-cy=username]')
      .type('James VI')
      .should('have.value', 'James VI')

    cy.get('[data-cy=password]')
      .type('longlivetheking')
      .should('have.value', 'longlivetheking')

    cy.get('form').submit()

    cy.url().should('eq', Cypress.config().baseUrl + 'dashboard')

    cy.request('GET', 'api/currentUser').its('body').then((body) => {
      expect(body).property('username').to.equal('James VI')
    })

    cy.get('[data-cy=sign-out-btn]').click()

    cy.url().should('eq', Cypress.config().baseUrl)
  })
})

describe('Access to pages based on authentication', () => {
  before('Clear all users except for permanent users', () => {
    fetch('/clear-users')
  })

  it('Unauthenticated user cannot access dashboard', () => {
    cy.visit('dashboard')

    cy.url().should('eq', Cypress.config().baseUrl)
  })

  it('Authenticated user cannot access login or register pages', () => {
    cy.visit('login')

    cy.get('input[name="username"]')
      .type('Archie')
      .should('have.value', 'Archie')

    cy.get('input[name="password"]')
      .type('sh33p123')
      .should('have.value', 'sh33p123')

    cy.get('form').submit()

    cy.url().should('eq', Cypress.config().baseUrl + 'dashboard')

    cy.visit('login')

    cy.url().should('eq', Cypress.config().baseUrl + 'dashboard')

    cy.visit('register')

    cy.url().should('eq', Cypress.config().baseUrl + 'dashboard')
  })
})
