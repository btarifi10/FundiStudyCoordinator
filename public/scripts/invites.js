'use strict'

let invites = []
let membershipNum = null

document.addEventListener('DOMContentLoaded', function () {
  getMembershipNum()
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
      tableHTML += `<td>${moment(time_sent).format('ddd, DD MMM YYYY')}</td>`

      tableHTML += `<td><button class="btn btn-success" style="border-radius:25px;width:60px" id="${invite_id}A" onClick="acceptInvite(this.id)"><i class="fa fa-check"></i></td>`
      tableHTML += `<td><button class="btn btn-danger" style="border-radius:25px;width:60px" id="${invite_id}R" onClick="declineInvite(this.id)"><i class="fa fa-times"</i></td>`

      tableHTML += '</tr>'
    })
    table.innerHTML = tableHTML
  }
}

// Make request to backend to accept invite
function acceptInvite (id) {
  const inviteId = parseInt(id)
  const groupId = invites.find(i => i.invite_id === inviteId).group_id

  // If a member of 10 groups - tell them they must leave a group to accept the invitation
  console.log(membershipNum)
  if (membershipNum >= 10) {
    window.alert('You must leave a group to accept this invite. You can only be a member of 10 groups')
    return
  }

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
          resolve(data)
        })
    })
  } catch (e) {
    console.log(e)
  }
}

function getMembershipNum () {
  fetch('/membership-views')
    .then(response => response.json())
    .then(data => {
      const groups = data.recordset
      membershipNum = groups.length
    })
}
