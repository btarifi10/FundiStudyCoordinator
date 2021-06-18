import { UserService } from './UserService.js'
const userService = UserService.getUserServiceInstance()
let currentUser = null

const profileTable = document.querySelector('table tbody')

document.addEventListener('DOMContentLoaded', () => {
  userService.getCurrentUser()
    .then(user => {
      currentUser = user
      displayProfile(currentUser)
    })
})

function displayProfile (currentUser) {
  document.getElementById('username').innerHTML = `<h3><strong>${currentUser.username}</strong></h3>`
  const profileHtml = `
        <tr>
            <th>First Name</th> <td>${currentUser.firstName}</td>
        </tr>
        <tr>
            <th>Last Name</th> <td>${currentUser.lastName}</td>
        </tr>
        <tr>
            <th>Rating</th> <td>${currentUser.rating}</td>
        </tr>
    `

  profileTable.innerHTML = profileHtml
}
