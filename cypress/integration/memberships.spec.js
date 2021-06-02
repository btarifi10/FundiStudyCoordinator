'use strict'
const GROUPS = [
  {
    group_id: '1',
    group_name: 'Phantom Menace',
    date_joined: new Date('1999'),
    group_num: '6',
    group_url: 'PM.html',
    group_online: '4'
  },
  {
    group_id: '2',
    group_name: 'Attack of the Clones',
    date_joined: new Date('2002'),
    group_num: '6',
    group_url: 'AC.html',
    group_online: '4'
  },
  {
    group_id: '3',
    group_name: 'Revenge of the Sith',
    date_joined: new Date('2005'),
    group_num: '6',
    group_url: 'RS.html',
    group_online: '4'
  },
  {
    group_id: '4',
    group_name: 'A New Hope',
    date_joined: new Date('1977'),
    group_num: '6',
    group_url: 'ANH.html',
    group_online: '4'
  },
  {
    group_id: '5',
    group_name: 'The Empire Strikes Back',
    date_joined: new Date('1980'),
    group_num: '6',
    group_url: 'ESB.html',
    group_online: '4'
  },
  {
    group_id: '6',
    group_name: 'Return of the Jedi',
    date_joined: new Date('1983'),
    group_num: '6',
    group_url: 'RJ.html',
    group_online: '4'
  }
]

// test('Test that the correct member values are displayed', () => {
//     loadHTMLTable(GROUPS);
//     document.body.innerHTML
// })

describe('Profile testing links', () => {
  it('Navigates from the profile page to the home page and back', () => {
    cy.visit('profile')

    cy.get('#home-link').click()
    cy.url().should('eq', Cypress.config().baseUrl + 'home')
    cy.get('#profile-link').click()
    cy.url().should('eq', Cypress.config().baseUrl + 'profile')
  })
  it('displays the membership information in the table', () => {
    cy.get('#table-body').contains('Revenge of the Sith')
  })
  it('refreshes a new set of information when button is pressed', () => {
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
  it('redirects to the correct URL when clicking on the membership name', () => {
    cy.get('#1-url').click()
    cy.url().should('eq', Cypress.config().baseUrl + 'PM.html')
    cy.visit('profile')
  })
})
