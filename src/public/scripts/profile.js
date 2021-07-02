import { UserService } from './user-service.js'
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
function showAddress (currentUser) {
  if (currentUser.addressLine1 == ' ' || currentUser.addressLine1 == null) {
    return 'No address saved'
  } else {
    const text = `${currentUser.addressLine1}, ${currentUser.addressLine2} <br> ${currentUser.city}, ${currentUser.postalCode}`
    return text
  }
}
function displayProfile (currentUser) {
  document.getElementById('username').innerHTML = `<h3><strong>${currentUser.username}</strong></h3>`
  const profileHtml = `
        <tr>
            <th>First Name</th> <td data-cy='user-first-name' >${currentUser.firstName}</td>
        </tr>
        <tr>
            <th>Last Name</th> <td data-cy='user-last-name'>${currentUser.lastName}</td>
        </tr>
        <tr>
            <th>Rating</th> <td data-cy='user-rating'>${currentUser.rating}</td>
        </tr>
        <tr>
            <th>Address</th> <td data-cy='user-address'>${showAddress(currentUser)}
        </td>
      </tr>
    `

  profileTable.innerHTML = profileHtml
}
