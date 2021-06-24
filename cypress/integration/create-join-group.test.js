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
  // before('Navigate to Create-Group page', () => {
  //   // Sign in
  //   cy.visit('/')

  //   cy.get('[data-cy=sign-in-homepage]').click()

  //   cy.get('form')

  //   cy.get('[data-cy=username]')
  //     .type('Archie')
  //     .should('have.value', 'Archie')

  //   cy.get('[data-cy=password]')
  //     .type('sh33p123')
  //     .should('have.value', 'sh33p123')

  //   cy.get('[data-cy=sign-in-login]')
  //     .click()
  // })

  it('Displays the create-join-group page', () => {
    // cy.url()
    //   .should('include', '/createGroup?username=Joe')

    // cy.get('input[name="groupName"]')
    //   .should('have.value', '')

    // cy.get('select[id="inviteList"]')
    //   .find('option')
    //   .should('have.length', 3)

    // cy.get('button[id="create-btn"]')
    //   .should('exist')

    // cy.get('table[id="table"]')
    //   .find('th')
    //   .should('have.length', 6)

    // cy.get('table[id="table"]')
    //   .find('tbody').find('tr')
    //   .should('have.length', 4)

    // cy.get('button[class="join-row-btn"]')
    //   .should('have.length', 4)

    // cy.get('button[class="delete-row-btn"]')
    //   .should('have.length', 0)
  })
})

describe('User can create a new group with chosen members invited automatically', () => {
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

describe('User can request to join groups that they are not members of', () => {
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
