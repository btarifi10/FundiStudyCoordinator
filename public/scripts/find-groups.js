'use strict'

let groups = []

document.addEventListener('DOMContentLoaded', function () {
  fetch('/get-other-groups')
    .then(response => response.json())
    .then(data => {
      groups = data
      populateAllGroups(groups)
    })
})

function entireGroupSearch () {
  const searchTerm = document.getElementById('group-search').value.toLowerCase()

  if (searchTerm) {
    const matchingGroups = groups.filter(g => g.group_name.toLowerCase().includes(searchTerm))
    populateAllGroups(matchingGroups)
  } else { populateAllGroups(groups) }
}

function populateAllGroups (data) {
  const table = document.querySelector('table tbody')
  if (data.length === 0) {
    table.innerHTML = "<tr><td class='no-data' colspan='4'>No Matching Groups</td></tr>"
    return
  }

  let tableHtml = ''

  data.forEach(function ({ group_id, group_name, course_code }) { // group_num, group_online, group_url }) {
    tableHtml += '<tr>'
    tableHtml += `<td id = '${group_id}-group-name'>${group_name}</td>`
    tableHtml += `<td id = '${group_id}-course-code'>${course_code}</td>`
    tableHtml += `<td><button class="btn btn-outline-warning border-0 join-row-btn" style="border-radius:25px;width:60px"
    id="${group_id}-btn" data-id=${group_id} onclick="joinGroup(this.dataset.id)">
          <i class="bi bi-plus-square"></i></td>`
    tableHtml += '</tr>'
  })
  table.innerHTML = tableHtml
}

function joinGroup (_groupId) {
  const groupId = parseInt(_groupId)
  const timeSent = moment()
  const reqObj = { groupId, timeSent }

  fetch('/sendRequest', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(reqObj)
  })

  const gId = groups.findIndex(g => g.group_id === groupId)

  alert(`A Request to join ${groups[gId].group_name.trim()} has been sent`)

  groups.splice(gId, 1)

  populateAllGroups(groups)
  document.getElementById('group-search').value = ''
}
