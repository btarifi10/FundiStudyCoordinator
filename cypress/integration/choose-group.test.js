
/* -------------------------- TESTING INSTRUCTIONS -----------------------------
Steps:
1) Open a terminal in the project's root directory
2) Run 'npm run dev' (this starts a local server at localhost:3000)
3) Open another terminal in the same directory
4) Run 'npm run e2e' (this starts the Cypress test environment)
5) Click on the file named 'choose-group.test.js'
6) This should open up a browser and run the tests below
NOTE: You will have needed to have installed all dependencies (including
developer dependencies)


Or 
Run './node_modules/.bin/cypress run'
----------------------------------------------------------------------------- */
describe('Confirming Index page loads correctly', () => {
  it('Index page loads ', () => {
    cy.visit('http://localhost:3000/choose-group')
  })

  it('Index page contains Study Groups drop down option ', () => {
    cy.contains('Study Groups')
  })

  it('Index page contains Home option  ', () => {
    cy.contains('Home')
  })

  it('Index page contains My Profile option  ', () => {
    cy.contains('My Profile')
  })

  it('Index page contains Chats option  ', () => {
    cy.contains('Chats')
  })
})

describe('Group Selection Testing', () => {
  const studyGroups = ['Big Data', 'Software 3', 'Sociology']

  beforeEach(() => {
    cy.visit('http://localhost:3000/choose-group')
  })

  it('Routes to the big data page when the Big Data Option is selected', () => {
    cy.get('#dropdown-buttonID').click()
    cy.get('#big-data').click()
    cy.location().should((loc) => {
      expect(loc.host).to.eq('localhost:3000')
      expect(loc.hostname).to.eq('localhost')
      expect(loc.href).to.eq(
        'http://localhost:3000/big-data')
    })
  })

  it('Routes to the software page when the Software 3 Option is selected', () => {
    cy.get('#dropdown-buttonID').click()
    cy.get('#software').click()
    cy.location().should((loc) => {
      expect(loc.host).to.eq('localhost:3000')
      expect(loc.hostname).to.eq('localhost')
      expect(loc.href).to.eq(
        'http://localhost:3000/software')
    })
  })

  it('Routes to the sociology page when the Sociology Option is selected', () => {
    cy.get('#dropdown-buttonID').click()
    cy.get('#sociology').click()
    cy.location().should((loc) => {
      expect(loc.host).to.eq('localhost:3000')
      expect(loc.hostname).to.eq('localhost')
      expect(loc.href).to.eq(
        'http://localhost:3000/sociology')
    })
  })
})

describe('Group Dropdown Population Testing', () => {
  const studyGroups = ['Big Data', 'Software 3', 'Sociology']

  beforeEach(() => {
    cy.visit('http://localhost:3000/choose-group')
  })

  it('Populates the dropdown with all list elements', () => {
    cy.get('#dropdown-buttonID').click()
    cy.contains(studyGroups[0])
    cy.contains(studyGroups[1])
    cy.contains(studyGroups[2])
  })
})

describe('Group Searching Testing', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/choose-group')
  })
  const studyGroups = ['Big Data', 'Software 3', 'Sociology']

  it('List only contains the filtered element', () => {
    cy.get('#dropdown-buttonID').click()
    cy.get('#inputValue')
      .type('Big Data')
      .get('#dropdown-containerID')
      .contains(studyGroups[1]).should('not.be.visible')

    cy.get('#inputValue')
      .clear()
      .type('Big Data')
      .get('#dropdown-containerID')
      .contains(studyGroups[2]).should('not.be.visible')

    cy.get('#inputValue')
      .clear()
      .type('Big Data')
      .get('#dropdown-containerID')
      .contains(studyGroups[0]).should('be.visible')
  })

  it('Has an empty selection view when group does not match search', () => {
    cy.get('#dropdown-buttonID').click()
    cy.get('#inputValue')
      .clear()
      .type('Apricot')
      .get('#dropdown-containerID')
      .contains(studyGroups[0]).should('not.be.visible')

    cy.get('#inputValue')
      .clear()
      .type('Apricot')
      .get('#dropdown-containerID')
      .contains(studyGroups[1]).should('not.be.visible')

    cy.get('#inputValue')
      .clear()
      .type('Apricot')
      .get('#dropdown-containerID')
      .contains(studyGroups[2]).should('not.be.visible')
  })

  it('Matches to the correct group indiscriminantly of case', () => {
    cy.get('#dropdown-buttonID').click()
    cy.get('#inputValue')
      .clear()
      .type('BiG dATA')
      .get('#dropdown-containerID')
      .contains(studyGroups[0]).should('be.visible')
  })

  it('Returns all groups with the corresponding typed letters', () => {
    cy.get('#dropdown-buttonID').click()
    cy.get('#inputValue')
      .clear()
      .type('S')
      .get('#dropdown-containerID')
      .contains(studyGroups[0]).should('not.be.visible')

    cy.get('#inputValue')
      .clear()
      .type('S')
      .get('#dropdown-containerID')
      .contains(studyGroups[1]).should('be.visible')


    cy.get('#inputValue')
      .clear()
      .type('S')
      .get('#dropdown-containerID')
      .contains(studyGroups[2]).should('be.visible')
  })
})
