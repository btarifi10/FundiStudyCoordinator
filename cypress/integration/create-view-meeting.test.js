/* eslint-env jest */

/* ----------------------- LOCAL TESTING INSTRUCTIONS --------------------------

Steps:

1) Open a terminal in the project's root directory
2) Run 'npm run dev' (this starts a local server at localhost:3000)
3) Open another terminal in the same directory
4) Run 'npm run e2e' (this starts the Cypress test environment)
5) Click on the file named 'create-view-meeting.test.js'
6) This should open up a browser and run the tests below

NOTE: You will have needed to have installed all dependencies (including
developer dependencies)

----------------------------------------------------------------------------- */

const moment = require('moment')

/* -------------------------------------------------------------------------- */

describe('Dynamically generated form elements load correctly', () => {
  before('Reset messages and meetings tables and navigate to create-meetings page', () => {
    configureMeetingTest(true, '/choose-location?group=Scotland')
  })

  it('Can choose a meeting date', () => {
    cy.get('[data-cy=meeting-form]').within(() => {
      cy.get('input:invalid').should('have.length', 1)

      cy.get('[data-cy=date-input]')
        .type('2022-03-13T16:20')

      cy.get('input:invalid').should('have.length', 0)

      cy.get('[data-cy=date-input]').clear()
    })
  })

  it('Correctly displays form when the online meeting method is selected', () => {
    cy.reload()

    cy.get('[data-cy=meeting-form]').within(() => {
      cy.get('input:invalid').should('have.length', 1)

      cy.get('[data-cy=method-input]')
        .select('online')

      cy.get('input:invalid').should('have.length', 2)

      cy.get('[data-cy=method-specific-div]')
        .should('include.text', 'Choose Platform')
        .and('include.text', 'Please enter the link for the meeting')

      cy.get('[data-cy=platform-input]')
        .should('be.visible')

      cy.get('[data-cy=link-input]')
        .should('be.visible')
    })
  })

  it('Correctly displays form when the face-to-face meeting method is selected', () => {
    cy.reload()

    cy.get('[data-cy=meeting-form]').within(() => {
      cy.get('input:invalid').should('have.length', 1)

      cy.get('[data-cy=method-input]')
        .select('face-to-face')

      cy.get('input:invalid').should('have.length', 2)

      cy.get('[data-cy=method-specific-div]')
        .should('include.text', 'Choose location')

      cy.get('[data-cy=address-input]')
        .should('be.visible')

      cy.get('[data-cy=recommend-btn]')
        .should('be.visible')

      cy.get('[data-cy=map]')
        .should('be.visible')
    })
  })

  it('Cannot submit form before meeting method is specified', () => {
    cy.reload()

    cy.get('[data-cy=meeting-form]').within(() => {
      cy.get('[data-cy=date-input]')
        .type('2022-03-13T16:20')

      cy.get('[data-cy=create-meeting]').click()

      cy.on('window:alert', (message) => {
        expect(message).to.contains('Please select a viable meeting option')
      })
    })
  })
})

/* -------------------------------------------------------------------------- */

describe('User can successfully create an online meeting', () => {
  before('Reset messages and meetings tables and navigate to create-meetings page', () => {
    configureMeetingTest(true, '/choose-location?group=Scotland')
  })

  it('Creates online meeting', () => {
    cy.get('[data-cy=meeting-form]').within(() => {
      cy.get('[data-cy=date-input]')
        .type('2022-03-13T16:20')
        .should('have.value', '2022-03-13T16:20')

      cy.get('[data-cy=method-input]')
        .select('online')
        .should('have.value', 'online')

      cy.get('[data-cy=platform-input]')
        .type('Discord')
        .should('have.value', 'Discord')

      cy.get('[data-cy=link-input]')
        .type('https://discord.com/')
        .should('have.value', 'https://discord.com/')

      cy.get('[data-cy=create-meeting]').click()

      cy.on('window:alert', (message) => {
        expect(message).to.contains('You have successfully created a Meeting')
      })
    })
  })

  it('A message is sent to the group chat after online meeting creation', () => {
    configureMeetingTest(false, '/chat?group=Scotland')

    cy.get('[data-cy="message-area"]')
      .find('.message')
      .should('have.length', 1)
      .and('include.text', 'Archie')
      .and('include.text', `${moment().format('HH:mm')}`)
      .and('include.text', 'A online meeting has been scheduled for Sun, 13 Mar 2022 at 16:20 by Archie')
  })
})

/* -------------------------------------------------------------------------- */

describe('User can successfully create a face-to-face meeting', () => {
  before('Reset messages and meetings tables and navigate to create-meetings page', () => {
    configureMeetingTest(true, '/choose-location?group=Scotland')
  })

  it('Creates face-to-face meeting', () => {
    cy.get('[data-cy=meeting-form]').within(() => {
      cy.get('[data-cy=date-input]')
        .type('2022-03-13T16:20')
        .should('have.value', '2022-03-13T16:20')

      cy.get('[data-cy=method-input]')
        .select('face-to-face')
        .should('have.value', 'face-to-face')

      cy.get('[data-cy=address-input]')
        .type('Gold Reef City')
        .should('have.value', 'Gold Reef City')

      cy.get('[data-cy=map]')
        .should('have.attr', 'src', 'https://www.google.com/maps/embed/v1/place?key=AIzaSyCx_ZKS9QvVboI8DL_D9jDGA4sBHiAR3fU&q=Gold%20Reef%20City&zoom=13')

      cy.get('[data-cy=create-meeting]').click()

      cy.on('window:alert', (message) => {
        expect(message).to.contains('You have successfully created a Meeting')
      })
    })
  })

  it('A message is sent to the group chat after face-to-face meeting creation', () => {
    configureMeetingTest(false, '/chat?group=Scotland')

    cy.get('[data-cy="message-area"]')
      .find('.message')
      .should('have.length', 1)
      .and('include.text', 'Archie')
      .and('include.text', `${moment().format('HH:mm')}`)
      .and('include.text', 'A face-to-face meeting has been scheduled for Sun, 13 Mar 2022 at 16:20 by Archie')
  })
})

/* -------------------------------------------------------------------------- */

describe('Automatic face-to-face recommendations function correctly', () => {
  before('Reset messages and meetings tables and navigate to create-meetings page', () => {
    configureMeetingTest(true, '/choose-location?group=Scotland')
  })

  beforeEach('Select face-to-face meeting', () => {
    cy.get('[data-cy=method-input]')
      .select('face-to-face')
      .should('have.value', 'face-to-face')
  })

  it('Correctly suggests current user\'s address', () => {
    cy.get('[data-cy=meeting-form]').within(() => {
      cy.get('[data-cy=recommend-btn]')
        .click()

      cy.get('[data-cy=user-location-btn]')
        .click()

      cy.get('[data-cy=address-input]')
        .should('have.value', '4 Kentucky Circle, Saddlebrook Estate, Johannesburg, 1684')
        .clear()
    })
  })

  it('Correctly suggests Wits address', () => {
    cy.get('[data-cy=meeting-form]').within(() => {
      cy.get('[data-cy=recommend-btn]')
        .click()

      cy.get('[data-cy=uni-location-btn]')
        .click()

      cy.get('[data-cy=address-input]')
        .should('have.value', '1 Jan Smuts Ave, Braamfontein, Johannesburg, 2000')
        .clear()
    })
  })

  it('Correctly suggests most central address', () => {
    cy.get('[data-cy=meeting-form]').within(() => {
      cy.get('[data-cy=recommend-btn]')
        .click()

      cy.get('[data-cy=central-location-btn]')
        .click()

      cy.get('[data-cy=address-input]')
        .should('have.value', 'Montecasino Blvd, Fourways, Sandton, 2067, South Africa')
        .clear()
    })
  })
})

/* ---------------------------- Helper Functions ---------------------------- */

function configureMeetingTest (clear, url) {
  // Clear messages and non-permanent entries in meetings table
  if (clear) {
    fetch('/clear-meetings')
    fetch('/clear-messages')
  }

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

  // Navigate to the specified URL
  cy.visit(url)
}
