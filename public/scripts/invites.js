'use strict'

let invites = []

document.addEventListener('DOMContentLoaded', function () {
  getInvites()
    .then(() => loadInvitesTable())
})

// This function refreshes the Table shown. The user can 'Join' groups they are not already in.
function loadInvitesTable () {
  const table = document.querySelector('#invite-table tbody')

  if (invites.length === 0) {
    table.innerHTML = "<tr><td class='no-data' colspan='6'>No Invites</td></tr>"
  } else {
    let tableHTML = ''

    invites.forEach(function ({ invite_id, group_id, group_name, course_code, time_sent }) {
      tableHTML += '<tr>'
      tableHTML += `<td>${group_name}</td>`
      tableHTML += `<td>${course_code}</td>`
      tableHTML += `<td>${time_sent.toLocaleString()}</td>`

      tableHTML += `<td><button class="btn btn-success" id="${invite_id}A" onClick="acceptInvite(this.id)">Yes</td>`
      tableHTML += `<td><button class="btn btn-danger" id="${invite_id}R" onClick="declineInvite(this.id)">No</td>`

      tableHTML += '</tr>'
    })
    table.innerHTML = tableHTML
  }
}

function acceptInvite (clicked_id) {
  const id = parseInt(clicked_id)
  const groupId = invites.find(i => i.invite_id === id).group_id

  fetch(`/api/acceptInvite?inviteId=${id}&groupId=${groupId}`, {
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
