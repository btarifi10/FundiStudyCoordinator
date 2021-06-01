'use strict'

import { UserService } from './UserService.js'

let currentUser = null

const userService = UserService.getUserServiceInstance()

document.addEventListener('DOMContentLoaded', () => {
  userService.getCurrentUser().then(
    user => {
      currentUser = user
      const welcomeDiv = document.getElementById('welcome-div')
      const welcomeHeading = document.createElement('h2')
      welcomeHeading.textContent = `Welcome, ${currentUser.username} with ID ${currentUser.id}`
      welcomeDiv.appendChild(welcomeHeading)
    }
  )

  /*
  userService.getCurrentUser()
    .then(user => {
      currentUser = user
      const welcomeDiv = document.getElementById('welcome-div')
      const welcomeHeading = document.createElement('h2')
      welcomeHeading.textContent = `Welcome, ${currentUser.username} with ID ${currentUser.id}`
      welcomeDiv.appendChild(welcomeHeading)
    })
    */
})
