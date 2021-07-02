const ARCHIE_USER_ID = 4
const BARRY_USER_ID = 28
const SCOTLAND_GROUP_ID = 6

describe('Invite polling events with a positive outcome', () => {
  before('Clear required database entries and navigate to polling page', () => {
    cy.clearCookies()
    cy.request('/clear-users')
      .then(() => cy.request('/clear-polls'))
      .then(() => cy.request(`/clear-invites?group_id=${SCOTLAND_GROUP_ID}`))
      .then(() => {
        removeUserFromGroup(BARRY_USER_ID, SCOTLAND_GROUP_ID)
        signInAsArchie()
        const groupName = 'SCOTLAND'
        cy.visit(`/polls?group=${groupName}`)
        cy.wait(4000)
      })
  })

  beforeEach('Stay signed in', () => {
    Cypress.Cookies.preserveOnce('connect.sid')
  })

  it('The polling page starts at the member admin section', () => {
    cy.get('[data-cy=member-tab]').should('have.attr', 'aria-selected', 'true')
  })

  it('Search for a user successfully', () => {
    cy.get('[data-cy=invite-box]').click()

    cy.get('[data-cy=user-search]')
      .type('barry')
      .then(() => {
        cy.wait(1000)
        cy.get('[data-cy=invite-user-tbl]').find('tr').should('have.length', 2)
        cy.get('[data-cy=invite-user-tbl]').should('contain', 'barry')
      })
  })

  it('Start a poll to invite the user', () => {
    cy.get('[data-cy=invite-barry-btn]').click()

    cy.on('window:alert', (str) => {
      expect(str).to.contain(
        'The poll to invite barry has been successfully created.'
      )
    })

    cy.wait(1000)
  })

  it('The invite no longer shows', () => {
    cy.get('[data-cy=invite-user-tbl]').find('tr').should('have.length', 2)
    cy.get('[data-cy=invite-user-tbl]').should('not.contain', 'barry')
  })

  it('New invite poll shows up in list and has no votes', () => {
    cy.get('[data-cy=active-poll-tab]')
      .click()
      .should('have.attr', 'aria-selected', 'true')

    cy.get('.poll')
      .first()
      .within(() => {
        cy.get('.poll-title').should('contain', 'Invite barry to group')
        cy.get('canvas').then((chart) => {
          cy.expect(chart.data.datasets).to.equal(undefined)
        })
      })
  })

  it('A user can vote in the invites poll', () => {
    cy.get('[data-cy=active-poll-tab]')
      .click()
      .should('have.attr', 'aria-selected', 'true')

    cy.get('.poll')
      .first()
      .within(() => {
        cy.get('.poll-title').should('contain', 'Invite barry to group')
        cy.get('input[data-cy=opt-0]').click()
        cy.get('.btn').contains('Vote').click()
      })

    cy.get('.poll')
      .first()
      .within(() => {
        cy.get('.poll-content').should(
          'contain',
          'You have already voted in this poll'
        )
      })
  })

  it('Other users can vote in the poll', () => {
    // Vote yes
    mockOtherUser(5, 0, 0)

    // Vote no
    mockOtherUser(6, 0, 1)

    cy.get('[data-cy=active-poll-tab]')
      .click()
      .should('have.attr', 'aria-selected', 'true')

    cy.get('.poll')
      .first()
      .within(() => {
        cy.get('.poll-title').should('contain', 'Invite barry to group')
        cy.get('canvas')
      })
  })

  it('A correct positive outcome is logged and stored', () => {
    cy.wait(15000)
    cy.reload()
    cy.wait(3000)
    cy.get('[data-cy=old-poll-tab]')
      .click()
      .should('have.attr', 'aria-selected', 'true')
    cy.get('.poll').first().should('contain', 'Outcome: Yes')
  })

  it('The invite is sent for a positive outcome', () => {
    cy.request(
      `/get-user-invites-to-group?userId=${BARRY_USER_ID}&groupId=${SCOTLAND_GROUP_ID}`
    )
      .then((response) => response.body)
      .then((invites) => {
        expect(invites.length).to.equal(1)
        expect(invites[0].group_id).to.equal(6)
      })
  })
})

describe('Invite polling events with a negative outcome', () => {
  before('Clear required database entries and navigate to polling page', () => {
    cy.clearCookies()
    cy.request('/clear-users')
      .then(() => cy.request('/clear-polls'))
      .then(() => cy.request(`/clear-invites?group_id=${SCOTLAND_GROUP_ID}`))
      .then(() => {
        signInAsArchie()
        const groupName = 'SCOTLAND'
        cy.visit(`/polls?group=${groupName}`)
        cy.wait(4000)
      })
  })

  beforeEach('Stay signed in', () => {
    Cypress.Cookies.preserveOnce('connect.sid')
  })

  it('Search for and start a poll to invite the user successfully', () => {
    cy.get('[data-cy=invite-box]').click()

    cy.get('[data-cy=user-search]')
      .type('barry')
      .then(() => {
        cy.wait(1000)
        cy.get('[data-cy=invite-user-tbl]').find('tr').should('have.length', 2)
        cy.get('[data-cy=invite-user-tbl]').should('contain', 'barry')
      })

    cy.get('[data-cy=invite-barry-btn]').click()

    cy.on('window:alert', (str) => {
      expect(str).to.contain(
        'The poll to invite barry has been successfully created.'
      )
    })

    cy.wait(1000)
  })

  it('Voting with a negative majority', () => {
    cy.get('[data-cy=active-poll-tab]')
      .click()
      .should('have.attr', 'aria-selected', 'true')

    cy.get('.poll')
      .first()
      .within(() => {
        cy.get('.poll-title').should('contain', 'Invite barry to group')
        cy.get('input[data-cy=opt-1]').click()
        cy.get('.btn').contains('Vote').click()
      })

    cy.get('.poll')
      .first()
      .within(() => {
        cy.get('.poll-content').should(
          'contain',
          'You have already voted in this poll'
        )
      })

    // Vote Yes
    mockOtherUser(5, 0, 0)

    // Vote no
    mockOtherUser(6, 0, 1)
  })

  it('A correct negative outcome is logged and stored', () => {
    cy.wait(15000)
    cy.reload()
    cy.wait(5000)
    cy.get('[data-cy=old-poll-tab]')
      .click()
      .should('have.attr', 'aria-selected', 'true')
    cy.get('.poll').first().should('contain', 'Outcome: No')
  })

  it('The invite is not sent for a negative outcome', () => {
    cy.request(
      `/get-user-invites-to-group?userId=${BARRY_USER_ID}&groupId=${SCOTLAND_GROUP_ID}`
    )
      .then((response) => response.body)
      .then((invites) => {
        expect(invites.length).to.equal(0)
      })
  })
})

describe('A group request can be voted on and accepted', () => {
  before('Clear required database entries and navigate to polling page', () => {
    cy.clearCookies()
    cy.request('/clear-users')
      .then(() => cy.request('/clear-polls'))
      .then(() => cy.request(`/clear-requests?group_id=${SCOTLAND_GROUP_ID}`))
      .then(() => {
        mockGroupRequest(BARRY_USER_ID, SCOTLAND_GROUP_ID)
        signInAsArchie()
        const groupName = 'SCOTLAND'
        cy.visit(`/polls?group=${groupName}`)
        cy.wait(4000)
      })
  })

  beforeEach('Stay signed in', () => {
    Cypress.Cookies.preserveOnce('connect.sid')
  })

  after('Remove the accepted user from the group', () => {
    removeUserFromGroup(BARRY_USER_ID, SCOTLAND_GROUP_ID)
  })

  it('The group request is visible', () => {
    cy.get('[data-cy=requests-box]').click()

    cy.get('[data-cy=group-req-tbl]').find('tr').should('have.length', 2)
    cy.get('[data-cy=group-req-tbl]').should('contain', 'barry')
  })

  it('Start a poll to accept the group request', () => {
    cy.get('[data-cy=accept-barry-btn]').click()

    cy.on('window:alert', (str) => {
      expect(str).to.contain('The poll has been successfully created.')
    })

    cy.wait(1000)
  })

  it('The group request no longer shows', () => {
    cy.get('[data-cy=group-req-tbl]').find('tr').should('have.length', 2)
    cy.get('[data-cy=group-req-tbl]').should('not.contain', 'barry')
  })

  it('New group request poll shows up in list and has no votes', () => {
    cy.get('[data-cy=active-poll-tab]')
      .click()
      .should('have.attr', 'aria-selected', 'true')

    cy.get('.poll')
      .first()
      .within(() => {
        cy.get('.poll-title').should(
          'contain',
          'Accept group request from barry'
        )
        cy.get('canvas').then((chart) => {
          cy.expect(chart.data.datasets).to.equal(undefined)
        })
      })
  })

  it('A user can vote in the requests poll', () => {
    cy.get('[data-cy=active-poll-tab]')
      .click()
      .should('have.attr', 'aria-selected', 'true')

    cy.get('.poll')
      .first()
      .within(() => {
        cy.get('.poll-title').should(
          'contain',
          'Accept group request from barry'
        )
        cy.get('input[data-cy=opt-0]').click()
        cy.get('.btn').contains('Vote').click()
      })

    cy.get('.poll')
      .first()
      .within(() => {
        cy.get('.poll-content').should(
          'contain',
          'You have already voted in this poll'
        )
      })
  })

  it('Other users can vote in the poll', () => {
    // Vote yes
    mockOtherUser(5, 0, 0)

    // Vote no
    mockOtherUser(6, 0, 1)

    cy.get('[data-cy=active-poll-tab]')
      .click()
      .should('have.attr', 'aria-selected', 'true')

    cy.get('.poll')
      .first()
      .within(() => {
        cy.get('.poll-title').should(
          'contain',
          'Accept group request from barry'
        )
        cy.get('canvas')
      })
  })

  it('A correct positive outcome is logged and stored', () => {
    cy.wait(15000)
    cy.reload()
    cy.wait(1000)
    cy.get('[data-cy=old-poll-tab]')
      .click()
      .should('have.attr', 'aria-selected', 'true')
    cy.get('.poll').first().should('contain', 'Outcome: Yes')
  })

  it('The accepted user is now a member of the group', () => {
    // cy.visit('/')
    // cy.clearCookies()
    // signInAsArchie()
    // cy.visit('/polls?group=SCOTLAND').then(() => {
    cy.wait(1000)
    cy.get('[data-cy=member-tab]')
      .click()
      .should('have.attr', 'aria-selected', 'true')
    cy.get('[data-cy=ban-box]').click()
    cy.get('[data-cy=ban-user-tbl]').find('tr').should('have.length', 4)
    cy.get('[data-cy=ban-user-tbl]').should('contain', 'Sheep')
    cy.get('[data-cy=ban-user-tbl]').should('contain', 'barry')
    cy.get('[data-cy=ban-user-tbl]').should('contain', 'James VI')
    // })
  })
})

describe('A user can be banned from a group after voting on it', () => {
  before('Clear required database entries and navigate to polling page', () => {
    cy.clearCookies()
    cy.request('/clear-users')
      .then(() => cy.request('/clear-polls'))
      .then(() => {
        mockAddUserToGroup(BARRY_USER_ID, SCOTLAND_GROUP_ID)
        signInAsArchie()
        const groupName = 'SCOTLAND'
        cy.visit(`/polls?group=${groupName}`)
        cy.wait(4000)
      })
  })

  beforeEach('Stay signed in', () => {
    Cypress.Cookies.preserveOnce('connect.sid')
  })

  after('Clear polls database', () => {
    cy.request('/clear-polls')
  })

  it('Member is in the group', () => {
    cy.get('[data-cy=ban-box]').click()

    cy.get('[data-cy=ban-user-tbl]').should('contain', 'barry')
  })

  it('Start a poll to ban the member', () => {
    cy.get('[data-cy=ban-barry-btn]').click()

    cy.on('window:alert', (str) => {
      expect(str).to.contain(
        'The poll to ban barry has been successfully created.'
      )
    })

    cy.wait(1000)
  })

  it('New banning poll shows up in list and has no votes', () => {
    cy.get('[data-cy=active-poll-tab]')
      .click()
      .should('have.attr', 'aria-selected', 'true')

    cy.get('.poll')
      .first()
      .within(() => {
        cy.get('.poll-title').should('contain', 'Ban barry from SCOTLAND')
        cy.get('canvas').then((chart) => {
          cy.expect(chart.data.datasets).to.equal(undefined)
        })
      })
  })

  it('A user can vote in the banning poll', () => {
    cy.get('[data-cy=active-poll-tab]')
      .click()
      .should('have.attr', 'aria-selected', 'true')

    cy.get('.poll')
      .first()
      .within(() => {
        cy.get('.poll-title').should('contain', 'Ban barry from SCOTLAND')
        cy.get('input[data-cy=opt-0]').click()
        cy.get('.btn').contains('Vote').click()
      })

    cy.get('.poll')
      .first()
      .within(() => {
        cy.get('.poll-content').should(
          'contain',
          'You have already voted in this poll'
        )
      })
  })

  it('Other users can vote in the poll', () => {
    // Vote yes
    mockOtherUser(5, 0, 0)

    // Vote no
    mockOtherUser(6, 0, 1)

    cy.get('[data-cy=active-poll-tab]')
      .click()
      .should('have.attr', 'aria-selected', 'true')

    cy.get('.poll')
      .first()
      .within(() => {
        cy.get('.poll-title').should('contain', 'Ban barry from SCOTLAND')
        cy.get('canvas')
      })
  })

  it('A correct positive outcome is logged and stored', () => {
    cy.wait(15000)
    cy.reload()
    cy.wait(1000)
    cy.get('[data-cy=old-poll-tab]')
      .click()
      .should('have.attr', 'aria-selected', 'true')
    cy.get('.poll').first().should('contain', 'Outcome: Yes')
  })

  it('The banned user is no longer a member of the group', () => {
    cy.wait(1000)
    cy.get('[data-cy=member-tab]')
      .click()
      .should('have.attr', 'aria-selected', 'true')
    cy.get('[data-cy=ban-box]').click()
    cy.get('[data-cy=ban-user-tbl]').should('not.contain', 'barry')
  })
})

describe('Custom polls can be created and voted on', () => {
  before('Clear required database entries and navigate to polling page', () => {
    cy.clearCookies()
    cy.request('/clear-users')
      .then(() => cy.request('/clear-polls'))
      .then(() => {
        signInAsArchie()
        const groupName = 'SCOTLAND'
        cy.visit(`/polls?group=${groupName}`)
        cy.wait(4000)
      })
  })

  beforeEach('Stay signed in', () => {
    Cypress.Cookies.preserveOnce('connect.sid')
  })

  after('Clear polls database', () => {
    cy.request('/clear-polls')
  })

  it('The tab to create a new poll can be visited', () => {
    cy.get('[data-cy=new-poll-tab]')
      .click()
      .should('have.attr', 'aria-selected', 'true')
  })

  it('The new poll can not be created with an invalid title', () => {
    cy.get('[data-cy=create-poll-btn').click()
    cy.on('window:alert', (str) => {
      expect(str).to.contain(
        'Please give the poll a valid title'
      )
    })

    cy.get('[data-cy=create-poll-btn').click()

    cy.get('[data-cy=custom-title]').clear().type('      ')

    cy.on('window:alert', (str) => {
      expect(str).to.contain(
        'Please give the poll a valid title.'
      )
    })
  })

  it('The new poll can not be created without valid options', () => {
    cy.get('[data-cy=custom-title]').clear().type('Should the sheep stage a coup?')

    cy.get('[data-cy=create-poll-btn').click()

    cy.on('window:alert', (str) => {
      expect(str).to.contain(
        'Please fill in all option fields.'
      )
    })
  })

  it('The new poll can not be created with an invalid duration', () => {
    cy.get('[data-cy=custom-title]').clear().type('Should the sheep stage a coup?')

    cy.get('[data-cy=custom-options').clear().type('3')

    cy.get('[data-cy=add-options-btn').click()

    cy.get('[data-cy=new-option-0').clear().type('Yes')
    cy.get('[data-cy=new-option-1').clear().type('No')
    cy.get('[data-cy=new-option-2').clear().type('Let Obama decide')

    cy.get('[data-cy=new-duration').clear().type('-2')

    cy.get('[data-cy=create-poll-btn').click()

    cy.on('window:alert', (str) => {
      expect(str).to.contain(
        'Please give the poll a valid duration.'
      )
    })
  })

  it('The new poll can be created with valid inputs', () => {
    cy.get('[data-cy=new-poll-tab]').click()

    cy.get('[data-cy=custom-title]').clear().type('Should the sheep stage a coup?')

    cy.get('[data-cy=custom-options').clear().type('3')

    cy.get('[data-cy=add-options-btn').click()

    cy.get('[data-cy=new-option-0').clear().type('Yes')
    cy.get('[data-cy=new-option-1').clear().type('No')
    cy.get('[data-cy=new-option-2').clear().type('Let Obama decide')

    cy.get('[data-cy=new-duration').clear().type('0.083')

    cy.get('[data-cy=create-poll-btn').click()

    cy.on('window:alert', (str) => {
      expect(str).to.contain(
        'The poll has been successfully created.'
      )
    })
  })

  it('New custom poll shows up in list and has no votes', () => {
    cy.wait(500)

    cy.get('[data-cy=active-poll-tab]')
      .click()
      .should('have.attr', 'aria-selected', 'true')

    cy.get('.poll')
      .first()
      .within(() => {
        cy.get('.poll-title').should('contain', 'Should the sheep stage a coup?')
        cy.get('canvas').then((chart) => {
          cy.expect(chart.data.datasets).to.equal(undefined)
        })
      })
  })

  it('A user can vote in the custom poll', () => {
    cy.get('[data-cy=active-poll-tab]')
      .click()
      .should('have.attr', 'aria-selected', 'true')

    cy.get('.poll')
      .first()
      .within(() => {
        cy.get('.poll-title').should('contain', 'Should the sheep stage a coup?')
        cy.get('input[data-cy=opt-2]').click()
        cy.get('.btn').contains('Vote').click()
      })

    cy.get('.poll')
      .first()
      .within(() => {
        cy.get('.poll-content').should(
          'contain',
          'You have already voted in this poll'
        )
      })
  })

  it('Other users can vote in the poll', () => {
    mockOtherUser(5, 0, 2)
    mockOtherUser(7, 0, 2)
    mockOtherUser(6, 0, 1)
    mockOtherUser(8, 0, 0)

    cy.get('[data-cy=active-poll-tab]')
      .click()
      .should('have.attr', 'aria-selected', 'true')

    cy.get('.poll')
      .first()
      .within(() => {
        cy.get('.poll-title').should('contain', 'Should the sheep stage a coup?')
        cy.get('canvas')
      })
  })

  it('The correct outcome is logged and stored', () => {
    cy.wait(15000)
    cy.reload()
    cy.wait(1000)
    cy.get('[data-cy=old-poll-tab]')
      .click()
      .should('have.attr', 'aria-selected', 'true')
    cy.get('.poll').first().should('contain', 'Outcome: Let Obama decide')
  })
})

function mockOtherUser (user, poll, optionNum) {
  cy.window().then(function (win) {
    const group = 'SCOTLAND'
    const voteBody = {
      userId: user,
      pollId: poll,
      option: optionNum
    }

    const socket = win.io()
    socket.emit('voterConnection', group)
    socket.emit('vote', voteBody)
  })
}

function mockGroupRequest (user, group) {
  cy.request(`/mock-request?user_id=${user}&group_id=${group}`)
}

function removeUserFromGroup (user, group) {
  cy.request(`/remove-user-from-group?user_id=${user}&group_id=${group}`)
}

function mockAddUserToGroup (user, group) {
  cy.request(`/add-user-to-group?user_id=${user}&group_id=${group}`)
}

function signInAsArchie () {
  cy.visit('login')
  cy.get('form')

  cy.get('[data-cy=username]').type('Archie').should('have.value', 'Archie')

  cy.get('[data-cy=password]')
    .type('sh33p123')
    .should('have.value', 'sh33p123')

  cy.get('form').submit()

  cy.url().should('eq', Cypress.config().baseUrl + 'dashboard')
}
