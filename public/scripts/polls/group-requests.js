'use strict'

let requests = null

function getGroupRequests (group) {
  return fetch(`/api/get-group-requests?group=${group}`)
    .then(response => response.json())
}

function updateRequestsTable (data) {
  requests = data

  const table = document.querySelector('#invite-table tbody')

  if (invites.length === 0) {
    table.innerHTML = "<tr><td class='no-data' colspan='6'>No Invites</td></tr>"
  } else {
    let tableHTML = ''

    // Display details for each invite
    invites.forEach(function ({ invite_id, group_id, group_name, course_code, time_sent }) {
      tableHTML += '<tr>'
      tableHTML += `<td>${group_name}</td>`
      tableHTML += `<td>${course_code}</td>`
      tableHTML += `<td>${time_sent.toLocaleString()}</td>`

      tableHTML += `<td><button class="btn btn-success" id="${invite_id}A" onClick="acceptInvite(this.id)"><i class="fa fa-check"></i></td>`
      tableHTML += `<td><button class="btn btn-danger" id="${invite_id}R" onClick="declineInvite(this.id)"><i class="fa fa-times"</i></td>`

      tableHTML += '</tr>'
    })
    table.innerHTML = tableHTML
  }
}

function loadInvitesTable () {
  const table = document.querySelector('#invite-table tbody')

  if (invites.length === 0) {
    table.innerHTML = "<tr><td class='no-data' colspan='6'>No Invites</td></tr>"
  } else {
    let tableHTML = ''

    // Display details for each invite
    invites.forEach(function ({ invite_id, group_id, group_name, course_code, time_sent }) {
      tableHTML += '<tr>'
      tableHTML += `<td>${group_name}</td>`
      tableHTML += `<td>${course_code}</td>`
      tableHTML += `<td>${time_sent.toLocaleString()}</td>`

      tableHTML += `<td><button class="btn btn-success" id="${invite_id}A" onClick="acceptInvite(this.id)"><i class="fa fa-check"></i></td>`
      tableHTML += `<td><button class="btn btn-danger" id="${invite_id}R" onClick="declineInvite(this.id)"><i class="fa fa-times"</i></td>`

      tableHTML += '</tr>'
    })
    table.innerHTML = tableHTML
  }
}

export { getGroupRequests }
