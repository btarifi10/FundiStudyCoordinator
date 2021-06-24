* eslint-env jest */

/* ----------------------- LOCAL TESTING INSTRUCTIONS --------------------------

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

import { formatDatabaseMessage, recordMessage } from '../../public/scripts/group-chat/chat-messages'

const moment = require('moment')

/* -------------------------------------------------------------------------- */

describe('A single user can join and send messages in the group chat', () => {
  before('Clear messages table and navigate to group chat', configureMessageTest)

  it('Displays the page correctly', () => {
    cy.get('[data-cy=group-header-name]')
      .should('have.text', 'Scotland')

    cy.get('[data-cy=members-in-chat]')
      .find('li')
      .should('have.length', 1)
      .and('have.text', 'Archie')
  })

  it('Can send messages that appear in the chat', () => {
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

/* -------------------------------------------------------------------------- */

describe('A user can share links to external content in the chat', () => {
  before('Clear messages table and navigate to group chat', configureMessageTest)

  it('Can send links with protocols', () => {
    cy.get('[data-cy=message-input]')
      .type('http://www.staggeringbeauty.com/')

    cy.get('[data-cy=send-button]').click()

    cy.get('[data-cy="message-area"]')
      .find('.text').last()
      .within(() => {
        cy.get('a')
          .should('have.text', 'http://www.staggeringbeauty.com/')
          .and('have.attr', 'target', '_blank')
          .and('have.attr', 'href', 'http://www.staggeringbeauty.com/')
      })
  })

  it('Can send links without protocols', () => {
    cy.get('[data-cy=message-input]')
      .type('www.staggeringbeauty.com')

    cy.get('[data-cy=send-button]').click()

    cy.get('[data-cy="message-area"]')
      .find('.text').last()
      .within(() => {
        cy.get('a')
          .should('have.text', 'www.staggeringbeauty.com')
          .and('have.attr', 'target', '_blank')
          .and('have.attr', 'href', 'http://www.staggeringbeauty.com')
      })
  })

  it('Can send domain name links', () => {
    cy.get('[data-cy=message-input]')
      .type('staggeringbeauty.com')

    cy.get('[data-cy=send-button]').click()

    cy.get('[data-cy="message-area"]')
      .find('.text').last()
      .within(() => {
        cy.get('a')
          .should('have.text', 'staggeringbeauty.com')
          .and('have.attr', 'target', '_blank')
          .and('have.attr', 'href', 'http://staggeringbeauty.com')
      })
  })

  it('Can send email links', () => {
    cy.get('[data-cy=message-input]')
      .type('archie.armstring@gmail.com')

    cy.get('[data-cy=send-button]').click()

    cy.get('[data-cy="message-area"]')
      .find('.text').last()
      .within(() => {
        cy.get('a')
          .should('have.text', 'archie.armstring@gmail.com')
          .and('have.attr', 'target', '_blank')
          .and('have.attr', 'href', 'mailto:archie.armstring@gmail.com')
      })
  })

  it('Correctly truncates links above 40 characters', () => {
    cy.get('[data-cy=message-input]')
      .type('https://www.ALinkWithFortyCharacters.com')

    cy.get('[data-cy=send-button]').click()

    cy.get('[data-cy="message-area"]')
      .find('.text').last()
      .within(() => {
        cy.get('a')
          .should('have.text', 'https://www.ALinkWithFortyCharacters.com')
          .and('have.attr', 'target', '_blank')
          .and('have.attr', 'href', 'https://www.ALinkWithFortyCharacters.com')
      })

    cy.get('[data-cy=message-input]')
      .type('https://www.ALinkWithMoreThanFortyCharacters.com')

    cy.get('[data-cy=send-button]').click()

    cy.get('[data-cy="message-area"]')
      .find('.text').last()
      .within(() => {
        cy.get('a')
          .should('have.text', 'https://www.ALinkWit…nFortyCharacters.com')
          .and('have.attr', 'target', '_blank')
          .and('have.attr', 'href', 'https://www.ALinkWithMoreThanFortyCharacters.com')
      })
  })
})

/* -------------------------------------------------------------------------- */

describe('Messages are correctly grouped by date', () => {
  before('Configure message test and add time spaced messages', () => {
    configureMessageTest()
    addTimeSpacedMessages()
  })

  it('Groups and formats date-dividers relative to the current day', () => {
    
  })
})

/* ---------------------------- Helper Functions ---------------------------- */

function configureMessageTest () {
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

  // Navigate to the 'Scotland' group chat
  cy.visit('/chat?group=Scotland')
}

function addTimeSpacedMessages () {
  let time = moment().add(1, 'days')

  for (let i = 0; i < 8; i++) {
    time = moment(time).subtract(1, 'days').format()
    const text = `Sent at ${time}`
    const databaseMessage = {
      group: 'Scotland',
      username: 'Archie',
      text: text,
      time: time
    }
    recordMessage(databaseMessage)
  }
}