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

describe('The correct page is displayed to the user when entering the create-join-group page', () => {
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

    cy.get('[data-cy=find-groups]')
      .click()
  })

  // MIGHT NEED A THIRD USER WHO IS NOT IN ANY GROUPS, SO THAT THEY CAN COME AND SEE A GROUP OR TWO

  it('Displays the join-group page', () => {
    cy.getIframeBody('dashboard-iframe').within(() => {
      cy.get('[data-cy=group-search]')
        .should('have.text', '')

      //   cy.get('[data-cy=group-table]')
      //     .should('have.text', '') should have a length of 1 (depending on how many groups exist) (try delete group after making it)

      cy.get('select[data-cy="user-list"]')
        .find('option')
        .should('have.length', 1)
    })
  })
})
