
'use strict'

import { UserService } from './UserService.js'

let currentUser = null

const userService = UserService.getUserServiceInstance()

document.addEventListener('DOMContentLoaded', () => {
  // Retrieves current user once document is loaded.
  userService.getCurrentUser().then(
    user => {
      currentUser = user
      console.log(currentUser.firstName.json())
    //   const welcomeDiv = document.getElementById('welcome-div')
    //   const welcomeHeading = document.createElement('h2')
    //   welcomeHeading.textContent = `Welcome, ${currentUser.firstName} ${currentUser.lastName}`
    //   welcomeDiv.appendChild(welcomeHeading)
    }
  )
})



function processCovidScreening () {
// Possibly replace with better pop up
  alert('Information Captured')
  //  addScreeningResult()
  //   updateScreening()
//   getCurrentUser() 
  addScreeningResult(updateScreening())
}

function getAllSelectedAnswers () {
  const symptomsQ1 = document.getElementById('SymptomsQ1').value
  const symptomsQ2 = document.getElementById('SymptomsQ2').value
  const contactQ1 = document.getElementById('ContactQ1').value
  const contactQ2 = document.getElementById('ContactQ2').value
  const contactQ3 = document.getElementById('ContactQ3').value
  const contactQ4 = document.getElementById('ContactQ4').value

  //   if symptomsQ1 ==='yes' || symptomsQ2 ==='yes' || contactQ1 ==='yes' || contactQ2 ==='yes'
  //   return '0'
  //   else
  //   return '1'

  if (symptomsQ1 === 'yes' || symptomsQ2 === 'yes' || contactQ1 === 'yes' || contactQ2 === 'yes') {
    // alert('WRONG')
    return 0
  } else {
    // alert('RIGHT')
    return 1
  }
}

function updateScreening () {
  const newScreening = {
    user_id: 0,
    passed: getAllSelectedAnswers(),
    date: new Date()
  }

  return newScreening
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

// function passedScreening () {

// }

// async function addScreeningResult () {
//   try {
//     const status = await new Promise((resolve, reject) => {
//       db.pools
//         .then((pool) => {
//           return pool.request()
//             .input('userid', db.sql.id, '2')
//             .input('passed', db.sql.bit, '1')
//             .input('date', db.sql.dateoffset, '2020-12-12 11:30:30.12345')

//             .query(`
//                     INSERT INTO dbo.screening(user_id, passed,date_screened)
//                     VALUES (@userid, @passed, @date);
//                 `)
//         })
//         .then(result => {
//           resolve(result.rowsAffected === [1])
//         })
//     })
//     return status
//   } catch (error) {
//     console.log(error)
//   }
// }
