'use strict'
describe('The user can view their personal/profile details', () => {
  before('Log in', () => {
    configureTests()
  })
  it('displays the username, first and last names and rating', () => {
    cy.get('[data-cy=profile-btn]').click()

    cy.getIframeBody('dashboard-iframe').within(() => {
      cy.wait(2000)
      cy.get('[data-cy=username-text]')
        .contains('Archie')
      cy.get('[data-cy=profile-table]').within(() => {
        cy.get('[data-cy=user-first-name]')
          .contains('Archibald')
        cy.get('[data-cy=user-last-name]')
          .contains('Armstrong')
        cy.get('[data-cy=user-rating]')
          .contains('5')
      })
    })
  })
})

describe('User can view and navigate between their groups', () => {
  beforeEach('Log in', () => {
    configureTests()
  })

  it('displays the membership information when the page loads', () => {
  // By using multiple different methods, it is ensured that nothing is left out from the code
  // Make sure that the term is found somewhere within the table

    cy.url().should('eq', Cypress.config().baseUrl + 'dashboard')

    // navigate to 'my groups'
    cy.get('#a-my-groups').click()
    cy.url().should('eq', Cypress.config().baseUrl + 'dashboard#my-groups')

    // Navigate to the 'Scotland' group
    cy.getIframeBody('dashboard-iframe').within(() => {
      cy.wait(2000)
      cy.get('#6-group-name')
        .contains('Scotland')
      cy.get('#6-course-code')
        .should('have.text', 'UNICORN007')
      cy.get('#6-date-joined')
        .should('have.text', 'Thu, 24 Jun 2021')
    })
  })

  it('redirects to the correct page when clicking the group-name', () => {
    // Navigate to the 'Scotland' group
    cy.getIframeBody('dashboard-iframe').within(() => {
      cy.wait(1000)
      cy.get('#6-group-name')
        .within(() => {
          cy.get('a')
            .invoke('attr', 'href')
            .should('equal', '/chat?group=Scotland')
            // .should('have.attr', 'href', '/chat?group=Scotland')
          cy.get('a')
            .click()
        })
    })
    cy.getIframeBody('dashboard-iframe').within(() => {
      cy.wait(1000)
      cy.get('[data-cy=group-header-name]')
        .should('have.text', 'Scotland')
    })

    // cy.wait(25000)
    // cy.get('#sign-out').click()
  })
})

function configureTests () {
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
