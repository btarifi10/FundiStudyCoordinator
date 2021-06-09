'use strict'
import data from '../fixtures/memberships.json'
const GROUPS = data.GROUPS
const GROUPS2 = data.GROUPS2
function createStringComparisons (data) {
  let firstTable = ''

  data.forEach(function ({ group_id, group_name, date_joined, group_num, group_online, group_url }) {
    firstTable += `${group_id}`
    firstTable += `${group_name}` //  tableHtml += `<td>${group_name}</td>`;
    firstTable += `${new Date(date_joined).toLocaleString()}`
    firstTable += `${group_num}`
    firstTable += `${group_online}`
    firstTable += 'Navigate'
    firstTable += 'Leave'
  })
  return firstTable
}

describe('Profile testing links', () => {
  // beforeEach(function () {
  //   cy.fixture('memberships.json').then((GROUPS) => {
  //     this.GROUPS = GROUPS
  //     // console.log(GROUPS)
  //   })
  // })
  // it('Navigates from the profile page to the home page and back', () => {
  //   cy.visit('profile')

  //   cy.get('#home-link').click()
  //   cy.url().should('eq', Cypress.config().baseUrl + 'dashboard')
  //   cy.get('#profile-link').click()
  //   cy.url().should('eq', Cypress.config().baseUrl + 'profile')
  // })
  // it('displays the membership information when the page loads', () => {
  //   // By using multiple different methods, it is ensured that nothing is left out from the code
  //   // Make sure that the term is found somewhere within the table
  //   cy.visit('profile')
  //   const fTable = "" //createStringComparisons(GROUPS)
  //   cy.get('#table-body')
  //     .invoke('text')
  //     .should((text1) => {
  //       expect(text1).to.eq(fTable)
  //     })
  // })

  // // this will be better implemented with jest functionality
  // it('each element of the membership information can be accessed independently', () => {
  //   // check the contents of the first entry
  //   cy.get('#1-id').should('not.be.empty')
  //   cy.get('#1-id').should('have.text', '1')
  //   cy.get('#1-group-name').should('have.text', 'Phantom Menace')
  //   // const newDate = new Date(1999).toLocaleString()
  //   // cy.get('#1-date-joined').should('have.text', '01/01/1999, 02:00:00')
  //   cy.get('#1-num-memb').should('have.text', '6')
  //   cy.get('#1-num-online').should('have.text', '4')
  // })

  // it('Changes the information when button is pressed', () => {
  //   //cy.fixture('memberships.json').as('GROUPS')
  //   //const fTable = createStringComparisons(GROUPS) // Star Wars
  //   const fTable2 = createStringComparisons(GROUPS2) // Disney
  //   console.log(GROUPS2)
  //   // show that the current entries are not the same as the Disney entries
  //   cy.get('#table-body') // Star Wars
  //     .invoke('text')
  //     .should((text1) => {
  //       expect(text1).not.to.eq(fTable2)
  //     })
  //   cy.get('#table-body')
  //     .invoke('text')
  //     .then((text1) => {
  //       cy.get('#membership-btn').click()
  //       cy.get('#table-body')
  //         .invoke('text')
  //         .should((text2) => {
  //           expect(text1).not.to.eq(text2)
  //         })
  //     })
  // })

  // it('Displays the correct information after the button is pressed', () => {
  //   // First entry after the button press should be 'The lion king'
  //   const fTable2 = createStringComparisons(GROUPS2)
  //   cy.get('#table-body')
  //     .invoke('text')
  //     .should((text1) => {
  //       expect(text1).to.eq(fTable2)
  //     })
  // })

  // it('redirects to the correct URL when clicking on the membership name', () => {
  //   // Selecting 'The Lion King'
  //   cy.get('#1-url').click()
  //   cy.url().should('eq', Cypress.config().baseUrl + 'TLK.html')
  //   cy.visit('profile')

  //   // Selecting 'A New Hope'
  //   cy.get('#4-url').click()
  //   cy.url().should('eq', Cypress.config().baseUrl + 'ANH.html')
  //   cy.visit('profile')
  // })
})
