import { UserService } from './UserService.js'
const userService = UserService.getUserServiceInstance()
let currentUser = null
document.addEventListener('DOMContentLoaded', function () {
  userService.getCurrentUser().then(
    user => {
      currentUser = user
      const welcomeDiv = document.getElementById('welcome-div')
      const welcomeHeading = document.createElement('h2')
      welcomeHeading.textContent = `Welcome, ${currentUser.username} with ID ${currentUser.id}`
      welcomeDiv.appendChild(welcomeHeading)

      fetch('http://localhost:3000/profileViews/' + currentUser.id)
        .then(response => response.json())
        .then(data => {
          console.log(data)
          loadProfile(data)
          fetch('http://localhost:3000/membershipViews/' + currentUser.id)
            .then(response => response.json())
            .then(data => {
              console.log(data)
              loadHTMLTable(data)
            })
        })
    })
})

document.querySelector('table tbody').addEventListener('click', function (event) {
  if (event.target.className == 'delete-row-btn') {
    LeaveGroup(event.target.dataset.id)
  }
})

function loadHTMLTable (data) {
  const table = document.querySelector('table tbody')
  console.log(data.recordset.length)
  if (data.recordsets.length === 0) {
    table.innerHTML = "<tr><td class='no-data' colspan='6'>No Memberships</td></tr>"
    return
  }

  let tableHtml = ''
  userService.getCurrentUser().then(
    user => {
      currentUser = user
      data.recordset.forEach(function ({ group_id, group_name, date_joined, membership_id }) { // group_num, group_online, group_url }) {
        tableHtml += '<tr>'
        tableHtml += `<td id='${group_id}-id'>${group_id}</td>`
        tableHtml += `<td id = '${group_id}-group-name'><a href='/chat?username=${currentUser.username}&group=${group_name}'>${group_name}</a></td>`
        tableHtml += `<td id = '${group_id}-date-joined'>${date_joined}</td>`
        tableHtml += `<td id = '${group_id}-num-memb'>group_num</td>`// ${group_num}</td>`
        tableHtml += `<td id = '${group_id}-num-online'>group_online</td>`// ${group_online}</td>`
        tableHtml += `<td><button class="delete-row-btn" data-id=${membership_id}>Leave</td>`
        tableHtml += '</tr>'
      })
      table.innerHTML = tableHtml
    })
}

function loadProfile (data) {
  const profile = document.querySelector('#user_details')
  if (data.recordset.length === 0) {
    profile.innerHTML = "<p class='no-data'>No Informations</p>"
    return
  }
  let tableHtml = ''

  data.recordset.forEach(function ({ username, first_name, last_name, rating }) { // group_num, group_online, group_url }) {
    tableHtml += `<p id='${username}-id'>Username: ${username}</p>`
    tableHtml += `<p id='${first_name}-id'>First name: ${first_name}</p>`
    tableHtml += `<p id='${last_name}-id'>Last name: ${last_name}</p>`
    tableHtml += `<p id='${rating}-id'>rating: ${rating}</p>`
  })
  profile.innerHTML = tableHtml
}

function LeaveGroup (membership_id) {
  fetch('http://localhost:3000/delete/' + membership_id, {
    method: 'DELETE'
  })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        location.reload()
      }
    })
}
