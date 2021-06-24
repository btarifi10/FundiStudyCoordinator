'use strict'

import { UserService } from './user-service.js'

let currentUser = null

const userService = UserService.getUserServiceInstance()

let iFrame = null

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
  iFrame = document.getElementById('iframe')
  // Retrieves current user once document is loaded.
  const url = window.location.toString()
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

// window.iframeLoaded = iframeLoaded
// function iframeLoaded (iframeObj) {
//   const iUrl = iframeObj.contentWindow.location
//   let href = iUrl.toString()
//   href = href.replace(`${iUrl.origin.toString()}/`, '')
//   const url = window.location.toString().split('#')[0]
//   window.location = url + `#${href}`
// }
