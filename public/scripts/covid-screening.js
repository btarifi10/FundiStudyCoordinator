
'use strict'

import { UserService } from './UserService.js'

const userService = UserService.getUserServiceInstance()
let currentUser = null
const submissionButton = document.getElementById('submission')
submissionButton.addEventListener('click', (event) => {
  event.preventDefault()
  processCovidScreening()
})



function processCovidScreening () {
// Possibly replace with better pop up
  alert('Information Captured')
  updateScreening()
}

function getAllSelectedAnswers () {
  const symptomsQ1 = document.getElementById('SymptomsQ1').value
  const symptomsQ2 = document.getElementById('SymptomsQ2').value
  const contactQ1 = document.getElementById('ContactQ1').value
  const contactQ2 = document.getElementById('ContactQ2').value
  const contactQ3 = document.getElementById('ContactQ3').value
  const contactQ4 = document.getElementById('ContactQ4').value


  if (symptomsQ1 === 'yes' || symptomsQ2 === 'yes' || contactQ1 === 'yes' || contactQ2 === 'yes') {
    return 0
  } else {
    return 1
  }
}

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

function addScreeningResult (newScreening) {
  fetch('/create-screening', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(newScreening)
  })
}
