/* eslint-env jest */

/* -------------------------- TESTING INSTRUCTIONS -----------------------------

Steps:

1) Open a terminal in the project's root directory
2) Run 'npm run dev' (this starts a local server at localhost:3000)
3) Open another terminal in the same directory
4) Run 'npm run e2e' (this starts the Cypress test environment)
5) Click on the file named 'chat-client.test.js'
6) This should open up a browser and run the tests below

NOTE: You will have needed to have installed all dependencies (including
developer dependencies)

----------------------------------------------------------------------------- */

/* ------------------------------ EXAMPLE TEST ---------------------------------

The test below demonstrates how to implement cypress tests that include the
database. I have created a 2 permanent users and a permanent group that should
NOT be removed from the table. More permanent entries can be added where
necessary.

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

Group 1:
group_id = 6
group_name = 'Scotland'
course_code = 'UNICORN007'
(NOTE: Both User 1 and User 2 are part of this group)

This means that any database calls that remove row entries should explicitly
avoid removing those involving the above user and group id's.

Additionally, to handle the difficulties of iframes, I've made a custom
function in cypress called getIframeBody()... see usage below

----------------------------------------------------------------------------- */

const moment = require('moment')

describe('A single user can join and send messages in the group chat', () => {
  before('Clear messages table and navigate to group chat', () => {
    // Clear messages table
    fetch('/clear-messages')

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

    // Navigate to the 'Scotland' group
    cy.getIframeBody('dashboard-iframe')
      .contains('Scotland')
      .click()
  })

  // it('Displays the page correctly', () => {
  //   cy.getIframeBody('dashboard-iframe').within(() => {
  //     cy.get('[data-cy=group-header-name]')
  //       .should('have.text', 'Scotland')

  //     cy.get('[data-cy=members-in-chat]')
  //       .find('li')
  //       .should('have.length', 1)
  //       .and('have.text', 'Archie')
  //   })
  // })

  it('Can send messages that appear in the chat', () => {
    cy.getIframeBody('dashboard-iframe').within(() => {
      cy.get('form')
      cy.get('[data-cy=message-input]')
        .type('Hello? Any sheep around here?')
        .should('have.focus')

      cy.get('[data-cy=send-button]').click()

      cy.get('[data-cy="message-area"]')
        .find('.message')
        .should('have.length', 1)
        .and('include.text', 'Archie')
        .and('include.text', `${moment().format('HH:mm')}`)
        .and('include.text', 'Hello? Any sheep around here?')
    })
  })
})
