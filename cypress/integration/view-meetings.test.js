const Archie = { username: 'Archie', password: 'sh33p123' }
const Jamie = { username: 'James VI', password: 'longlivetheking' }
const Sheep = { username: 'Sheep', password: 'wool' }
const moment = require('moment')
// cy.get('[data-cy=]')
describe('User can navigate between meeting types', () => {
  beforeEach('Log in user', () => {
    configureLogin(Archie)
  })
  it('Displays the meetings options', () => {
    cy.get('[data-cy=onlineMeetingView]')
      .should('have.text', 'Online')

    cy.get('[data-cy=face2faceMeetingView]')
      .should('have.text', 'face-to-face')
  })

  it('Opens and correctly displays the online meetings view', () => {
    cy.get('[data-cy="onlineMeetingView"]').click()

    cy.get('[data-cy=meeting-id-3]')
      .should('have.text', '3')
    cy.get('[data-cy=meeting-group-3]')
      .should('have.text', 'Scotland')
    cy.get('[data-cy=creator-id-3]')
      .should('have.text', '4')
    const meeting_time = '2021-07-05 12:00:00.0000000 +02:00'
    const date = moment(meeting_time).format('ddd, DD MMM YYYY HH:mm')
    cy.get('[data-cy=meeting-time-3]')
      .should('have.text', date)
    cy.get('[data-cy=meeting-place-3]')
      .should('have.text', 'Microsoft Teams')

    cy.get('[data-cy=meeting-place-3]')
      .within(() => {
        cy.get('a')
          .should('have.text', 'Microsoft Teams')
          .and('have.attr', 'target', '_blank')
          .and('have.attr', 'href', 'https://teams.microsoft.com/l/channel/19%3ac28be551715948bd9a244317273785af%40thread.tacv2/General?groupId=2bd99e7b-f2c6-4379-9d52-0bce78942072&tenantId=4b1b908c-5582-4377-ba07-a36d65e34934')
      })
  })
  it('allows the user to view the face-to-face meetings', () => {
    cy.get('[data-cy="face2faceMeetingView"]').click()

    cy.get('[data-cy=meeting-id-2]')
      .should('have.text', '2')
    cy.get('[data-cy=meeting-group-2]')
      .should('have.text', 'Scotland')
    cy.get('[data-cy=creator-id-2]')
      .should('have.text', '4')
    cy.get('[data-cy=meeting-time-2]')
      .should('have.text', 'Mon, 05 Jul 2021 12:00')
    cy.get('[data-cy=meeting-place-2]')
      .should('have.text', '1 Jan Smuts Ave, Braamfontein, Johannesburg, 2000')

    cy.get('[data-cy=meeting-place-2]')
      .within(() => {
        cy.get('a')
          .should('have.text', '1 Jan Smuts Ave, Braamfontein, Johannesburg, 2000')
          .and('have.attr', 'target', '_blank')
          .and('have.attr', 'href', 'https://www.google.com/maps/dir/?api=1&destination=1%20Jan%20Smuts%20Ave,%20Braamfontein,%20Johannesburg,%202000')
      })

    // // can attend
    // cy.get('[data-cy=attend-meeting-2-btn]').click()
  })
})

describe('User cannot view face-to-face meetings if they have not passed covid screening', () => {
  it('disallows the user to view the face-to-face meetings if they have not recently passed the covid screening', () => {
    configureLogin(Jamie)
    cy.get('[data-cy="face2faceMeetingView"]').click()
    cy.get('[data-cy=empty-table-text]')
      .should('have.text', 'In the last 72hours you have failed your most recent covid screening')
  })

  it('prohibits the user from viewing the face-to-face meetings if they have not done the covid screening', () => {
    configureLogin(Sheep)
    cy.get('[data-cy="face2faceMeetingView"]').click()
    cy.get('[data-cy=empty-table-text]')
      .should('have.text', 'Please complete the covid screening to view the face to face meetings')
  })
})

function configureLogin (user) {
  // Sign in
  cy.visit('/')

  cy.get('[data-cy=sign-in-homepage]').click()

  cy.get('form')

  cy.get('[data-cy=username]')
    .type(user.username)
    .should('have.value', user.username)

  cy.get('[data-cy=password]')
    .type(user.password)
    .should('have.value', user.password)

  cy.get('[data-cy=sign-in-login]')
    .click()

  // Navigate to the 'Scotland' group chat
  cy.visit('/chat?group=Scotland')

  cy.get('[data-cy=ViewMeetings]').click()
}
