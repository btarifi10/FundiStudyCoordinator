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
//const moment = require('moment')

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

    cy.get('[data-cy=create-group]')
      .click()
  })

  it('Displays the create-group page', () => {
    cy.getIframeBody('dashboard-iframe').within(() => {
      cy.get('[data-cy=group-name]')
        .should('have.text', '')

      cy.get('[data-cy=course-code]')
        .should('have.text', '')

      cy.get('select[data-cy="user-list"]')
        .find('option')
        .should('have.length', 1)
    })
  })
})

describe('User can create a new group with chosen members invited (automatically added for now)', () => {
  it('Allows user to input Group information and add member to invite', () => {})

  it('Clears the group information form when group is created successfully', () => {})
  //   it('Allows user to input group name and select members to invite', () => {
  //     cy.get('input[name="groupName"]')
  //       .type('Jonas Brothers')
  //       .should('have.value', 'Jonas Brothers')

  //     cy.get('select[id="inviteList"]')
  //       .select(['Albus', 'Ron'])
  //       .invoke('val')
  //       .should('deep.equal', ['1', '3'])

  //     cy.get('button[id="JonasBrothers"]')
  //       .should('not.exist')

  //     cy.get('button[id="create-btn"]')
  //       .click()
  //   })

  // it('Updates table with new group: Admin is user, Members includes user and selected names', () => {
  //   cy.get('table[id="table"]')
  //     .contains('td', 'Jonas Brothers')
  //   cy.contains('td', 'Joe,Albus,Ron')
  //   cy.contains('td', 'Joe')

  //   cy.get('button[class="join-row-btn"]')
  //     .should('have.length', 4)

  //   cy.get('button[class="delete-row-btn"]')
  //     .should('have.length', 1)
  //     .should('have.id', 'JonasBrothers')
  // })

  // it('Does not allow user to create an existing group', () => {
  //   cy.get('input[name="groupName"]')
  //     .type('Jonas Brothers')
  //     .should('have.value', 'Jonas Brothers')

  //   cy.get('button[id="create-btn"]')
  //     .click()

  //   cy.on('window:alert', (txt) => {
  //     expect(txt).to.contains('Please enter a VALID group name, that does NOT already EXIST')
  //   })
  // })

  // it('Does not allow user to create a group name over 30 alphanumerics', () => {
  //   cy.get('input[name="groupName"]')
  //     .type('abcdefghijklmnopqrstuvwxyzabc1234')
  //     .should('have.value', 'abcdefghijklmnopqrstuvwxyzabc1234')

  //   cy.on('window:alert', (txt) => {
  //     expect(txt).to.contains('Please Enter a Valid Group Name. Group Name can only be 30 alphanumerics')
  //   })
  // })
})

describe('Users cannot input invalid group names and course codes', () => {
  it('Does not allow user to input group name that already exists', () => {})

  it('Does not allow user to input empty group name', () => {})

  it('Does not allow user to input group name not over 40 alphanumerics', () => {})

  it('Does not user to input course code not over 10 alphanumerics', () => {})

  it('Shows members to invite (excluding the current user)', () => {})

  it('Filters through the user list')
})

// describe('User cannot add a member twice', () => {})

// describe('User')

// JOIN FUNCTIONALITY (should maybe go into a separate file)

describe('User can join groups that they are not members of', () => {
  // it('Allows user to join groups they are not members of', () => {
  //   cy.get('table[id="table"]')
  //     .contains('td', 'LYFE')
  //     .siblings()
  //     .contains('Yasser,The boys')

  //   cy.get('button[id="LYFE"]')
  //     .click()

  //   cy.get('table[id="table"]')
  //     .contains('td', 'LYFE')
  //     .siblings()
  //     .contains('Yasser,The boys,Joe')

  //   cy.get('button[class="join-row-btn"]')
  //     .should('have.length', 3)
  // })
})
