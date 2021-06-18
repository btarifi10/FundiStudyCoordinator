'use strict'

import { UserService } from './UserService.js'

let currentUser = null

const userService = UserService.getUserServiceInstance()

const iFrame = document.getElementById('iframe')

document.getElementById('a-my-groups').addEventListener('click', () => {
  iFrame.src = '/my-groups'
})

document.getElementById('a-invites').addEventListener('click', () => {
  iFrame.src = '/invites'
})

document.getElementById('a-find-groups').addEventListener('click', () => {
  iFrame.src = '/find-groups'
})

document.getElementById('a-create-group').addEventListener('click', () => {
  iFrame.src = '/create-group'
})

document.getElementById('a-profile').addEventListener('click', () => {
  iFrame.src = '/profile'
})

document.getElementById('a-profile-user').addEventListener('click', () => {
  iFrame.src = '/profile'
})

document.addEventListener('DOMContentLoaded', () => {
  // Retrieves current user once document is loaded.
  const url = window.location.toString()
  console.log(url)
  if (url.includes('#')) {
    const path = url.split('#')[1]
    iFrame.src = `/${path}`
  }
  userService.getCurrentUser().then(
    user => {
      currentUser = user
      document.getElementById('a-profile-user').innerHTML = `${currentUser.firstName} ${currentUser.lastName}`
    }
  )
})
