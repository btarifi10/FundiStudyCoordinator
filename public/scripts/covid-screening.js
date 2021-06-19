
'use strict'

import { UserService } from './user-service.js'

const userService = UserService.getUserServiceInstance()
let currentUser = null

// Submits the Covid Screening results captured by the form
const submissionButton = document.getElementById('submission')
submissionButton.addEventListener('click', (event) => {
  event.preventDefault()
  updateScreening()
})

// Determines whether the person has passed the screening or not based on logic
// in Wits Covid screenign form

function getAllSelectedAnswers () {
  const symptomsQ1 = document.getElementById('SymptomsQ1').value
  const symptomsQ2 = document.getElementById('SymptomsQ2').value
  const contactQ1 = document.getElementById('ContactQ1').value
  const contactQ2 = document.getElementById('ContactQ2').value

  // Currently unused - for expanded functionality could send a pop up to say that you are high risk if
  // the perosn answers yes
  const contactQ3 = document.getElementById('ContactQ3').value
  const contactQ4 = document.getElementById('ContactQ4').value

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
  window.history.back()
}
