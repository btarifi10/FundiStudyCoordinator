

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
----------------------------------------------------------------------------- */

describe('My First Test', () => {
  it('Does not do much!', () => {
    expect(true).to.equal(true)
  })
})

// describe('Group Selection Testing', () => {
//   it('Routes to the big data page when the Big Data Option is selected', () => {

//   })

//   it('Routes to the software page when the Software 3 Option is selected', () => {

//   })

//   it('Routes to the sociology page when the Sociology Option is selected', () => {

//   })
// })

// describe('Group Searching Testing', () => {
//   it('Filters to the correct value when group is present', () => {
//     cy.get('input[name="inputValue"]')
//       .type('Big Data')
//       .should('have.value', 'Big Data')
//   })

//   it('Has an empty selection view when group inputted does not match search', () => {

//   })
// })
