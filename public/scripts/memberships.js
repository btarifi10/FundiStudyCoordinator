import { UserService } from './UserService.js'
const userService = UserService.getUserServiceInstance()
let currentUser =  null

document.addEventListener('DOMContentLoaded', function () {
  fetch('http://localhost:3000/getAll')
    .then(response => response.json())
    .then(data => {
      userGroups = data
      loadHTMLTable(userGroups)
    })
})

document.querySelector('table tbody').addEventListener('click', function (event) {
  if (event.target.className == 'delete-row-btn') {
    LeaveGroup(event.target.dataset.id)
  }
  if (event.target.className == 'navigate-group-btn') {
    handleNavigation(event.target.dataset.id)
  }
})

function handleNavigation () {
  location.href = 'memberships.html'
}

const membBtn = document.querySelector('#membership-btn')
membBtn.onclick = function () {
  userService.getCurrentUser().then(
    user => {
      currentUser = user
      fetch('http://localhost:3000/membershipViews/' + currentUser.id)
        .then(response => response.json())
        .then(data => {
          console.log(data)
          loadHTMLTable(data)
        }
        )
    })
}

function loadHTMLTable (data) {
  const table = document.querySelector('table tbody')
  console.log(data.recordset.length)
  if (data.recordsets.length === 0) {
    table.innerHTML = "<tr><td class='no-data' colspan='7'>No Memberships</td></tr>"
    return
  }

  let tableHtml = ''

  data.recordset.forEach(function ({ group_id, group_name, date_joined, membership_id }) { // group_num, group_online, group_url }) {
    tableHtml += '<tr>'
    tableHtml += `<td id='${group_id}-id'>${group_id}</td>`
    tableHtml += `<td id = '${group_id}-group-name'>${group_name}</td>`
    tableHtml += `<td id = '${group_id}-date-joined'>${date_joined}</td>`
    tableHtml += `<td id = '${group_id}-num-memb'>group_num</td>`// ${group_num}</td>`
    tableHtml += `<td id = '${group_id}-num-online'>group_online</td>`// ${group_online}</td>`
    tableHtml += `<td><button class="navigate-group-btn" data-id=${group_id}>Navigate</td>`
    tableHtml += `<td><button class="delete-row-btn" data-id=${membership_id}>Leave</td>`
    tableHtml += '</tr>'
  })
  table.innerHTML = tableHtml
}

function LeaveGroup (membership_id) {
  console.log(membership_id)
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
