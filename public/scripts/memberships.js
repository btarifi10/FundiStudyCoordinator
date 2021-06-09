import { UserService } from './UserService.js'
// import { currentUser } from './dashboard.js'
//let currentUser = null
// const {
//   currentUser
// } = require('./dashboard.js')

// console.log(currentUser.username)

const userService = UserService.getUserServiceInstance()

document.addEventListener('DOMContentLoaded', function () {
  userService.getCurrentUser().then(
    user => {
      currentUser = user
      const welcomeDiv = document.getElementById('welcome-div')
      const welcomeHeading = document.createElement('h2')
      welcomeHeading.textContent = `Welcome, ${currentUser.username} with ID ${currentUser.id}`
      welcomeDiv.appendChild(welcomeHeading)
    })
  fetch('http://localhost:3000/profileViews')//  , {
    // headers: {
    //     'Content-type': 'application/json'
    // },
    // method: 'POST',
    // body: JSON.stringify({user_id : userService.getCurrentUser().id})
    // })
    .then(response => response.json())
    .then(data => {
      console.log(data)
      loadProfile(data)
      //loadHTMLTable(data)
      //console.log(userGroups)
    })
    // .then(data => console.log(data))
  // loadHTMLTable([''])
})

document.querySelector('table tbody').addEventListener('click', function (event) {
  if (event.target.className == 'delete-row-btn') {
    LeaveGroup(event.target.dataset.group_id)
  }
  if (event.target.className == 'navigate-group-btn') {
    handleNavigation(event.target.dataset.group_id)
  }
})

function handleNavigation () {
  location.href = 'memberships.html'
}

const membBtn = document.querySelector('#membership-btn')
membBtn.onclick = function () {
  fetch('http://localhost:3000/membershipViews')
  .then(response => response.json())
    .then(data => {
      console.log(data)
      loadHTMLTable(data)
})}

function loadHTMLTable (data) {
  const table = document.querySelector('table tbody'); 
  console.log(data.recordset.length)
  //userGroups = data.recordset[1].group_id//[['group_id', 'group_name', 'date_created']]
  if (data.recordsets.length === 0) {
    table.innerHTML = "<tr><td class='no-data' colspan='7'>No Memberships</td></tr>"
    return
  }

  let tableHtml = ''

  data.recordset.forEach(function ({ group_id, group_name, date_created}) {//group_num, group_online, group_url }) {
    tableHtml += '<tr>'
    tableHtml += `<td id='${group_id}-id'>${group_id}</td>`
    tableHtml += `<td id = '${group_id}-group-name'>${group_name}</td>` //  tableHtml += `<td>${group_name}</td>`;
    tableHtml += `<td id = '${group_id}-date-joined'>${date_created}</td>`
    tableHtml += `<td id = '${group_id}-num-memb'>group_num</td>`//${group_num}</td>`
    tableHtml += `<td id = '${group_id}-num-online'>group_online</td>`//${group_online}</td>`
    tableHtml += `<td><button class="navigate-group-btn" data-id=${group_id}>Navigate</td>`
    tableHtml += `<td><button class="delete-row-btn" data-id=${group_id}>Leave</td>`
    tableHtml += '</tr>'
  })

  table.innerHTML = tableHtml
}

function loadProfile(data) {
  const profile = document.querySelector('#user_details'); 
  //userGroups = data.recordset[1].group_id//[['group_id', 'group_name', 'date_created']]
  if (data.recordset.length === 0) {
    profile.innerHTML = "<p class='no-data'>No Informations</p>"
    return
  }
  let tableHtml = ''

  data.recordset.forEach(function ({ username, first_name, last_name}) {//group_num, group_online, group_url }) {
    tableHtml += `<p id='${username}-id'>Username: ${username}</p>`
    tableHtml += `<p id='${first_name}-id'>First name: ${first_name}</p>`
    tableHtml += `<p id='${last_name}-id'>Last name: ${last_name}</p>`
  })
  profile.innerHTML = tableHtml
}

function LeaveGroup (group_id) {
  fetch('http://localhost:3000/leaveGroup/' + group_id, {
    method: 'DELETE'
  })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        location.reload()
      }
    })
}
