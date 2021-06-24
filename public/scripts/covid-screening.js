
'use strict'

import { UserService } from './user-service.js'

const userService = UserService.getUserServiceInstance()
let currentUser = null

// Submits the Covid Screening results captured by the form
const submissionButton = document.getElementById('submission')
submissionButton.addEventListener('click', (event) => {
  event.preventDefault()
  updateScreening()
  alert('Screening results captured')
})

// Retrieves the new entry for each form element
// function getNewEntry (value) {
//   for (let i = 0; i < value.length; i++) {
//     if (value[i].checked) {
//       return parseInt(value[i].value, 10)
//     }
//   }
// }

// Determines whether the person has passed the screening or not based on logic
// in Wits Covid screenign form
function getAllSelectedAnswers () {
  // const symptomsQ1 = getNewEntry(document.getElementsByName('SymptomsQ1'))
  // const symptomsQ2 = getNewEntry(document.getElementsByName('SymptomsQ2'))
  // const contactQ1 = getNewEntry(document.getElementsByName('ContactQ1'))
  // const contactQ2 = getNewEntry(document.getElementsByName('ContactQ2'))

  // // Currently unused - for expanded functionality could send a pop up to say that you are high risk if
  // // the perosn answers yes
  // const contactQ3 = getNewEntry(document.getElementsByName('ContactQ3'))
  // const contactQ4 = getNewEntry(document.getElementsByName('ContactQ4'))

  const symptomsQ1 = document.getElementsByName('SymptomsQ1').value
  const symptomsQ2 = document.getElementsByName('SymptomsQ2').value
  const contactQ1 = document.getElementsByName('ContactQ1').value
  const contactQ2 = document.getElementsByName('ContactQ2').value

  // Currently unused - for expanded functionality could send a pop up to say that you are high risk if
  // the perosn answers yes
  const contactQ3 = document.getElementsByName('ContactQ3').value
  const contactQ4 = document.getElementsByName('ContactQ4').value

  if (symptomsQ1 === 'yes' || symptomsQ2 === 'yes' || contactQ1 === 'yes' || contactQ2 === 'yes') {
    return 0
  } else {
    return 1
  }
}

// Updates screening result in correct form for posting to database

function updateScreening () {
  userService.getCurrentUser().then(
    user => {
      currentUser = user

      const newScreening = {
        user_id: currentUser.id,
        passed: getAllSelectedAnswers(),
        date: new Date()
      }
      addScreeningResult(newScreening)
    })
}

// Posts results to the database

function addScreeningResult (newScreening) {
  fetch('/create-screening', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(newScreening)
  })
}
