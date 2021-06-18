'use strict'

let invites = []

document.addEventListener('DOMContentLoaded', function () {
  getInvites()
    .then(() => loadInvitesTable())
})

// Every time the table changes, it will be refreshed
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

// Make request to backend to accept invite
function acceptInvite (id) {
  const inviteId = parseInt(id)
  const groupId = invites.find(i => i.invite_id === inviteId).group_id

  fetch(`/api/acceptInvite?inviteId=${inviteId}&groupId=${groupId}`, {
    method: 'POST'
  }).then(res => {
    if (res.ok) {
      // On success: remove invite and update list
      invites.splice(invites.findIndex(i => i.invite_id === inviteId))
      loadInvitesTable()
    } else {
      window.alert('Request failed')
    }
  })
}

// Make request to backend to decline invite
function declineInvite (clicked_id) {
  const id = parseInt(clicked_id)

  fetch(`/api/declineInvite?inviteId=${id}`, {
    method: 'POST'
  }).then(res => {
    if (res.ok) {
      invites.splice(invites.findIndex(i => i.invite_id === id))
      loadInvitesTable()
    } else {
      window.alert('Request failed')
    }
  })
}

// Retrieve invites from backend
async function getInvites () {
  try {
    invites = await new Promise((resolve, reject) => {
      fetch('/api/getInvites', {
        method: 'GET'
      })
        .then(response => response.json())
        .then(data => {
          console.log(data)
          resolve(data)
        })
    })
  } catch (e) {
    console.log(e)
  }
}