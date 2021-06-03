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

const GROUPS2 = [
  {
    group_id: '1',
    group_name: 'The Lion King',
    date_joined: new Date('1994'),
    group_num: '200',
    group_url: 'TLK.html',
    group_online: '5'
  },
  {
    group_id: '2',
    group_name: 'Hercules',
    date_joined: new Date('1997'),
    group_num: '150',
    group_url: 'H.html',
    group_online: '10'
  },
  {
    group_id: '3',
    group_name: 'Onward',
    date_joined: new Date('2020'),
    group_num: '50',
    group_url: 'O.html',
    group_online: '30'
  },
  {
    group_id: '4',
    group_name: 'Tangled',
    date_joined: new Date('2010'),
    group_num: '30',
    group_url: 'T.html',
    group_online: '4'
  },
  {
    group_id: '5',
    group_name: 'Zootopia',
    date_joined: new Date('2016'),
    group_num: '10',
    group_url: 'Z.html',
    group_online: '5'
  },
  {
    group_id: '6',
    group_name: 'Coco',
    date_joined: new Date('2017'),
    group_num: '3',
    group_url: 'C.html',
    group_online: '1'
  }
]

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
    const fTable = createStringComparisons(GROUPS)
    cy.get('#table-body')
      .invoke('text')
      .should((text1) => {
        expect(text1).to.eq(fTable)
      })
  })

  // this will be better implemented with jest functionality
  it('each element of the membership information can be accessed independently', () => {
    // check the contents of the first entry
    cy.get('#1-id').should('not.be.empty')
    cy.get('#1-id').should('have.text', '1')
    cy.get('#1-group-name').should('have.text', 'Phantom Menace')
    // const newDate = new Date(1999).toLocaleString()
    cy.get('#1-date-joined').should('have.text', '01/01/1999, 02:00:00')
    cy.get('#1-num-memb').should('have.text', '6')
    cy.get('#1-num-online').should('have.text', '4')
  })

  it('Changes the information when button is pressed', () => {
    const fTable = createStringComparisons(GROUPS) // Star Wars
    const fTable2 = createStringComparisons(GROUPS2) // Disney
    // show that the current entries are not the same as the Disney entries
    cy.get('#table-body') // Star Wars
      .invoke('text')
      .should((text1) => {
        expect(text1).not.to.eq(fTable2)
      })
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
    const fTable2 = createStringComparisons(GROUPS2)
    cy.get('#table-body')
      .invoke('text')
      .should((text1) => {
        expect(text1).to.eq(fTable2)
      })
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
