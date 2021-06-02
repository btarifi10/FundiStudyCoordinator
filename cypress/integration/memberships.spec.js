'use strict'

describe('Profile testing links', () => {
  it('Navigates from the profile page to the home page and back', () => {
    cy.visit('profile')

    cy.get('#home-link').click()
    cy.url().should('eq', Cypress.config().baseUrl + 'home')
    cy.get('#profile-link').click()
    cy.url().should('eq', Cypress.config().baseUrl + 'profile')
  })
  it('displays the membership information when the page loads', () => {
    // By using multiple different methods, it is ensured that nothing is left out from the code
    // Make sure that the term is found somewhere within the table
    cy.get('#table-body').contains('Revenge of the Sith')
    // check the contents of the first entry
    cy.get('#table-body')
      .find('#1-id')
      .should('have.length', 1)
    cy.get('#1-id').should('not.be.empty')
    cy.get('#1-id').should('not.have.text', '2')
    cy.get('#1-id').should('not.have.value', '2')
    cy.get('#1-group-name').should('not.have.text', 'Hercules')
    cy.get('#1-group-name').should('have.text', 'Phantom Menace')
    // const newDate = new Date(1999).toLocaleString()
    cy.get('#1-date-joined').should('have.text', '01/01/1999, 02:00:00')
    cy.get('#1-num-memb').should('have.text', '6')
    cy.get('#1-num-online').should('have.text', '4')

    // check the contents of the last entry
    cy.get('#6-id').should('not.be.empty')
    cy.get('#6-id').should('not.have.text', '2')
    cy.get('#6-id').should('not.have.value', '2')
    cy.get('#6-group-name').should('not.have.text', 'Hercules')
    cy.get('#6-group-name').should('have.text', 'Return of the Jedi')
    cy.get('#6-date-joined').should('have.text', '01/01/1983, 02:00:00')
    cy.get('#6-num-memb').should('have.text', '6')
    cy.get('#6-num-online').should('have.text', '4')
  })

  it('Changes the information when button is pressed', () => {
    cy.get('#table-body')
      .invoke('text')
      .then((text1) => {
        cy.get('#membership-btn').click()
        cy.get('#table-body')
          .invoke('text')
          .should((text2) => {
            expect(text1).not.to.eq(text2)
          })
      })
  })

  it('Displays the correct information after the button is pressed', () => {
    // First entry after the button press should be 'The lion king'
    cy.get('#1-id').should('not.be.empty')
    cy.get('#1-group-name').should('not.have.text', 'Hercules')
    cy.get('#1-group-name').should('have.text', 'The Lion King')
    cy.get('#1-group-name').contains('The Lion King')
    cy.get('#1-date-joined').should('have.text', '01/01/1994, 02:00:00')
    cy.get('#1-num-memb').should('have.text', '200')
    cy.get('#1-num-online').should('have.text', '5')

    // the second entry is 'Hercules
    cy.get('#2-group-name').should('have.text', 'Hercules')

    // check the contents of the last entry
    cy.get('#6-id').should('not.be.empty')
    cy.get('#6-id').should('not.have.text', '2')
    cy.get('#6-id').should('not.have.value', '2')
    cy.get('#6-group-name').should('not.have.text', 'Hercules')
    cy.get('#6-group-name').should('have.text', 'Coco')
    cy.get('#6-date-joined').should('have.text', '01/01/2017, 02:00:00')
    cy.get('#6-num-memb').should('have.text', '3')
    cy.get('#6-num-online').should('have.text', '1')
  })

  it('redirects to the correct URL when clicking on the membership name', () => {
    // Selecting 'The Lion King'
    cy.get('#1-url').click()
    cy.url().should('eq', Cypress.config().baseUrl + 'TLK.html')
    cy.visit('profile')

    // Selecting 'A New Hope'
    cy.get('#4-url').click()
    cy.url().should('eq', Cypress.config().baseUrl + 'ANH.html')
    cy.visit('profile')
  })
})
