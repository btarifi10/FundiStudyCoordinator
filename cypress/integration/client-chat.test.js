/* eslint-env jest */

/* -------------------------- TESTING INSTRUCTIONS -----------------------------

Steps:

1) Open a terminal in the project's root directory
2) Run 'npm run dev' (this starts a local server at localhost:3000)
3) Open another terminal in the same directory
4) Run 'npm run e2e' (this starts the Cypress test environment)
5) Click on the file named 'client-chat.test.js'
6) This should open up a browser and run the tests below

NOTE: You will have needed to have installed all dependencies (including
developer dependencies)

----------------------------------------------------------------------------- */

const JOIN_CHAT_EVENT = 'joinChat'
const CHAT_MESSAGE_EVENT = 'chatMessage'

describe('A single client can join and send messages in the group chat', () => {
  before('Fill form to enter group chat', () => {
    cy.visit('/intermediate-chat')

    cy.get('form')

    cy.get('input[name="username"]')
      .type('Archibald')
      .should('have.value', 'Archibald')

    cy.get('select[name="group"]')
      .select('Sociology')
      .should('have.value', 'Sociology')

    cy.contains('Join Group').click()
  })
  it('Displays the page correctly', () => {
    cy.url()
      .should('include', '/chat?username=Archibald&group=Sociology')

    cy.get('span[id="group-name"]')
      .should('have.text', 'Sociology')

    cy.get('ul[id="chat-members"]')
      .find('li')
      .should('have.length', 1)
      .and('have.text', 'Archibald')
  })

  it('Receives a welcome message in the chat', () => {
    cy.get('div[class="message-area"]')
      .find('div')
      .should('have.length', 1)

    cy.get('div[class="message"]')
      .find('p[class="meta"]')
      .should('include.text', 'Study Bot')

    cy.get('div[class="message"]')
      .find('p[class="text"]')
      .should('have.text', 'Hey Archibald! Welcome to the Sociology group chat!')
  })

  it('Can send messages that appear in the chat', () => {
    cy.get('form')
    cy.get('input[id="msg"]')
      .type('Hello? Any sheep around here?')

    cy.focused()
      .should('have.id', 'msg')

    cy.contains('Send').click()

    cy.get('div[class="message-area"]')
      .find('div')
      .should('have.length', 2)

    cy.get('div[class="message-area"]')
      .find('div')
      .filter(':contains("sheep")')
      .find('p[class="meta"]')
      .should('include.text', 'Archibald')

    cy.get('div[class="message-area"]')
      .find('div')
      .filter(':contains("sheep")')
      .find('p[class="text"]')
      .should('have.text', 'Hello? Any sheep around here?')
  })
})

describe('Interact with other users in chat', () => {
  before('Mock user enters the group and writes a message', () => {
    cy.window()
      .then(function (win) {
        const mockUser = { username: 'James VI', group: 'Sociology' }
        const msg = 'Archy! Tell me a joke. I\'m feeling rather upset today. The sheep farmers are staging a coup'
        const socket = win.io()
        socket.emit(JOIN_CHAT_EVENT, mockUser)
        socket.emit(CHAT_MESSAGE_EVENT, msg)
      })
  })
  it('Updates list of chat members when a new member joins', () => {
    cy.get('ul[id="chat-members"]')
      .find('li')
      .should('have.length', 2)
      .within(() => {
        cy.contains('James')
          .should('have.text', 'James VI')
      })
  })
  it('Receives a join message when a new member joins', () => {
    cy.get('div[class="message-area"]')
      .find('div')
      .should('have.length', 4)
      .filter(':contains("James VI has joined")')
      .find('p[class="meta"]')
      .should('include.text', 'Study Bot')

    cy.get('div[class="message-area"]')
      .find('div')
      .filter(':contains("James VI has joined")')
      .find('p[class="text"]')
      .should('have.text', 'James VI has joined the chat!')
  })

  it('Receive messages from other members in chat', () => {
    cy.get('div[class="message-area"]')
      .find('div')
      .filter(':contains("joke")')
      .find('p[class="meta"]')
      .should('include.text', 'James VI')

    cy.get('div[class="message-area"]')
      .find('div')
      .filter(':contains("joke")')
      .find('p[class="text"]')
      .should('have.text', 'Archy! Tell me a joke. I\'m feeling rather upset today. The sheep farmers are staging a coup')
  })

  it('Receives a leave message when a member leaves', () => {
    cy.window()
      .then(function (win) {
        const mockUser = { username: 'sheep', group: 'Sociology' }
        const msg = 'Uh oh'
        const socket = win.io()
        socket.emit(JOIN_CHAT_EVENT, mockUser)
        socket.emit(CHAT_MESSAGE_EVENT, msg)
        setTimeout(() => {
          socket.disconnect()
        }, 1000)
      })

    cy.get('div[class="message-area"]')
      .find('div')
      .should('have.length', 7)
      .filter(':contains("left")')
      .find('p[class="meta"]')
      .should('include.text', 'Study Bot')

    cy.get('div[class="message-area"]')
      .find('div')
      .filter(':contains("left")')
      .find('p[class="text"]')
      .should('have.text', 'sheep has left the chat...')
  })
})
