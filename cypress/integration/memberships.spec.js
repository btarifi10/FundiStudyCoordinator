'use strict'
import data from '../fixtures/memberships.json'
const GROUPS = data.GROUPS
const GROUPS2 = data.GROUPS2
const moment = require('moment').default || require('moment')
function createStringComparisons (data) {
  let tableHtml = ''

  data.forEach(function ({ membership_id, group_id, group_name, course_code, date_joined }) { // group_num, group_online, group_url }) {
    tableHtml += '<tr>'
    tableHtml += `<td id = '${group_id}-group-name'><a href='/chat?group=${group_name}'>${group_name}</a></td>`
    tableHtml += `<td id = '${group_id}-course-code'>${course_code}</td>`
    tableHtml += `<td id = '${group_id}-date-joined'>${moment(date_joined).format('ddd, DD MMM YYYY')}</td>`
    tableHtml += `<td><button class="btn btn-outline-danger border-0 delete-row-btn" style="border-radius:25px;width:60px" id="${membership_id}-btn" data-id=${membership_id} onclick="leaveGroup(this.dataset.id)">
    <i class="bi bi-box-arrow-right"></i></td>`
    tableHtml += '</tr>'
  })
  return tableHtml
}

describe('Profile testing links', () => {
  // it('Navigates from the profile page to the home page and back', () => {
  //   cy.visit('profile')

  //   cy.get('#home-link').click()
  //   cy.url().should('eq', Cypress.config().baseUrl + 'home')
  //   cy.get('#profile-link').click()
  //   cy.url().should('eq', Cypress.config().baseUrl + 'profile')
  // })

  it('displays the membership information when the page loads', () => {
  // By using multiple different methods, it is ensured that nothing is left out from the code
  // Make sure that the term is found somewhere within the table

    // log the test user in
    cy.visit('login')
    cy.get('form')

    cy.get('input[name="username"]')
      .type('Archie')
      .should('have.value', 'Archie')

    cy.get('input[name="password"]')
      .type('sh33p123')
      .should('have.value', 'sh33p123')

    cy.get('form').submit()

    cy.url().should('eq', Cypress.config().baseUrl + 'dashboard')

    // navigate to 'my groups'
    cy.get('#a-my-groups').click()
    cy.url().should('eq', Cypress.config().baseUrl + 'dashboard#my-groups')

    // Navigate to the 'Scotland' group
    cy.getIframeBody('dashboard-iframe').within(() => {
      cy.wait(2000)
      // const fTable = createStringComparisons(GROUPS) // Disney
      // cy.get('#table-body', { timeout: 30000 })
      //   .invoke('text')
      //   .should((text1) => {
      //     expect(text1).not.to.eq(fTable)
      //   })
      cy.get('#6-group-name')
        .contains('Scotland')
        // .should('have.text', 'Scotland')
      cy.get('#6-course-code')
        .should('have.text', 'UNICORN007')
      cy.get('#6-date-joined')
        .should('have.text', 'Thu, 24 Jun 2021')
    })
  })
  it('Changes the information when button is pressed', () => {
    // Navigate to the 'Scotland' group
    // cy.getIframeBody('dashboard-iframe').within(() => {
    //   cy.wait(2000)
    //   cy.get('#6-group-name').click()
    // })
    cy.getIframeBody('dashboard-iframe')
      .contains('Scotland')
      .click()

    // check the route

    cy.wait(25000)
    cy.get('#sign-out').click()
  })
})
