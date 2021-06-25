/* eslint-env jest */
const labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
let labelIndex = 0
const moment = require('moment')

describe('A single user can join and send messages to the attendance page', () => {
  before('Navigate to the attendance page', () => {
    configureAttendanceTest()
  })

  it('Displays the page correctly', () => {
    cy.wait(6000)
    cy.clock()
    // check meeting name
    cy.get('[data-cy=group-header-name]')
      .should('have.text', 'Scotland')
    // check meeting ID
    cy.get('[data-cy=meeting-header-id]')
      .should('have.text', '2')

    // cy.wait(5000)
    cy.tick(6000)
    // check users 'A' - Archie
    const label = labels[labelIndex++ % labels.length]
    cy.get('[data-cy=members-in-chat]')
      .find('li')
      .should('have.length', 1)
      .and('have.text', `'${label}' - Archie`)
  })

  it('Sends a message from the study bot when joining the chat', () => {
    cy.get('[data-cy="message-area"]')
      .find('.message')
      .should('have.length', 1)
      .and('include.text', 'Study Bot')
      .and('include.text', 'Welcome Archie! By being in this chat you have confirmed your attendance to the meeting for Scotland!')
  })

  it('Can send messages that appear in the chat', () => {
    cy.wait(1000)
    cy.get('form')
    cy.get('[data-cy=message-input]')
      .type('Hello? Any sheep around here?')
      .should('have.focus')

    cy.get('[data-cy=send-btn]').click()
    cy.clock()
    cy.tick(5000)
    cy.wait(2000)
    cy.get('[data-cy="message-area"]')
      .find('.message')
      .should('have.length', 2)
      .and('include.text', 'Archie')
      .and('include.text', `${moment().format('HH:mm')}`)
      .and('include.text', 'Hello? Any sheep around here?')
  })
})

describe('More than one user can join the chat and share their location', () => {
  before('Navigate to the attendance page', () => {
    configureAttendanceTest()
  })

  it('Displays the updated list of chat members when a new member joins', () => {
    // adjust the label index including the current user
    labelIndex++

    // define the position of the newUser
    cy.wait(1000)
    const newPos = { lat: -25.2, lng: 28.2 }
    mockOtherUser(newPos)
    cy.wait(1000)

    cy.get('[data-cy="message-area"]')
      .find('.message')
      .should('have.length', 2)
      .and('include.text', 'Study Bot')
      .and('include.text', 'Strawberry has joined the chat!')

    cy.get('[data-cy=members-in-chat]')
      .find('li')
      .should('have.length', 2)

    cy.get('[data-cy=members-in-chat]')
      .find('li')
      .first()
      .should('have.text', `'${labels[labelIndex - 2]}' - Archie`)
      .next()
      .should('have.text', `'${labels[labelIndex - 1]}' - Strawberry`)

    cy.get('[data-cy=members-in-chat]')
      .find('li').last()
      .within(() => {
        cy.get('a')
          .should('have.text', `'${labels[labelIndex - 1]}' - Strawberry`)
          .and('have.attr', 'target', '_blank')
          .and('have.attr', 'href', 'https://www.google.com/maps/dir/?api=1&destination=-25.2,28.2')
      })
  })
})

describe('A message is automatically sent to the chat when certain conditions are met', () => {
  before('Navigate to the attendance page', () => {
    configureAttendanceTest()
  })
  it('The text of the location sharing button changes when pressed', () => {
    labelIndex++
    cy.get('[data-cy=location-sharing-btn]')
      .should('have.text', 'Stop Sharing')

    cy.get('[data-cy=location-sharing-btn]').click()
      .should('have.text', 'Continue Sharing')
  })

  it('A message is sent to the rest of the group when the user stops sharing their location', () => {
    const newPos = { lat: -26.5, lng: 28.2 }
    const changePosition = false
    cy.wait(1000)
    mockOtherUserPos(newPos, false, changePosition, 'Strawberry')
    cy.wait(1000)

    cy.get('[data-cy="message-area"]')
      .find('.message')
      .should('have.length', 3)
      .and('include.text', 'Study Bot')
      .and('include.text', 'Strawberry has stopped sharing their location!')
  })
  it('A message is sent to the rest of the group when the user reaches their location', () => {
    const newPos = { lat: -26.9, lng: 28.2 }
    const changePosition = false
    cy.wait(1000)
    mockOtherUserPos(newPos, true, changePosition, 'Brownie')
    cy.wait(1000)

    cy.get('[data-cy="message-area"]')
      .find('.message')
      .should('have.length', 5)
      .and('include.text', 'Study Bot')
      .and('include.text', 'Brownie has arrived safely at their destination!')
  })
  it('Updates the user direction link when their location changes', () => {
    const newPos = { lat: -26.5, lng: 28.2 }
    const newPos2 = { lat: -26.2, lng: 29.2 }
    const changePosition = true
    cy.wait(1000)
    mockOtherUserPos(newPos, true, changePosition, 'Cream')
    cy.wait(1000)

    cy.get('[data-cy=members-in-chat]')
      .find('li').last()
      .within(() => {
        cy.get('a')
          .should('have.text', `'${labels[labelIndex - 1]}' - Cream`)
          .and('have.attr', 'target', '_blank')
          .and('have.attr', 'href', `https://www.google.com/maps/dir/?api=1&destination=${newPos2.lat},${newPos2.lng}`)
      })
  })
})

function configureAttendanceTest () {
  // Assuming the user has passed covid screening in the last 72hours
  // Otherwise:
  /*  enter the group chat page, navigate to 'view-meetings', select 'face-to-face'
        check table message. Then navigate to the covid-screenings page and
        complete the form. navigate back to the 'view-meetings' and select 'face-to-face'
        once more. Click attend on the first meeting.
    */
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
  // cy.visit('/chat?group=Scotland')
  // navigate to view meetings using click
  cy.wait(2000)

  cy.visit('/attend-meeting?group=Scotland&meetingID=2')
}

function mockOtherUser (newPos) {
  const label = labels[labelIndex++ % labels.length]
  cy.window()
    .then(function (win) {
      const mockUser = { username: 'Strawberry', group: 'Scotland', meetingID: '2', position: newPos, label: label }
      const socket = win.io()
      socket.emit('joinMeeting', mockUser)
    })
}
function mockOtherUserPos (newPos, check, change, username) {
  const newPos2 = { lat: -26.2, lng: 29.2 }
  const label = labels[labelIndex++ % labels.length]
  cy.window()
    .then(function (win) {
      const mockUser = { username: username, group: 'Scotland', meetingID: '2', position: newPos, label: label }
      const socket = win.io()
      socket.emit('joinMeeting', mockUser)

      if (change == true) {
        socket.emit('changePosition', { username: 'Strawberry', group: 'Scotland', meetingID: '2', newPosition: newPos2 })
      }
      socket.emit('arrived', check)
    })
}
