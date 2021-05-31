import { UserDetails } from './models/userDetails.js'

let currentUser = {}

const baseUrl = 'http://localhost:6969/api'

document.addEventListener('DOMContentLoaded', () => {
  console.log('loaded')
  fetch(baseUrl + '/currentUser')
    .then(response => response.json())
    .then(data => {
      currentUser = new UserDetails(data.id, data.username)
      const welcomeDiv = document.getElementById('welcome-div')
      const welcomeHeading = document.createElement('h2')
      welcomeHeading.textContent = `Welcome, ${currentUser.username} with ID ${currentUser.id}`
      welcomeDiv.appendChild(welcomeHeading)
    })
})
