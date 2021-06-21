'use strict'

let groups = []

document.addEventListener('DOMContentLoaded', function () {
  getRecommendations()
  getTags()
})

// Function to get the recommended groups based on the tags of the user's groups
function getRecommendations () {
  fetch('/get-recommendation')
    .then(response => response.json())
    .then(data => {
      groups = data
      populateRecommendedGroups(groups)
    })
}

// Function to get all the tags of the users current groups
function getTags () {
  fetch('/get-tag-values')
    .then(response => response.json())
    .then(data => {
      populateTagsList(data)
    })
}

// Populates the tag list values
function populateTagsList (data) {
  if (data.length === 0) {
    document.getElementById('tag-values').innerHTML = 'No Recommendations Generated As No Tags Found'
  } else {
    let tagString = ''
    data.forEach(function ({ tag }) {
      tagString = tagString + ` ${tag.trim()},`
    })
    tagString = tagString.slice(0, -1)
    document.getElementById('tag-values').innerHTML = `Recommendations Based On Tags:<br> ${tagString}`
  }
}

// Populates the recommeneded groups values in a table
function populateRecommendedGroups (data) {
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
    id="${group_id}-btn" data-id=${group_id} onclick='joinGroup(this.dataset.id)' >
          <i class="bi bi-plus-square"></i></td>`
    tableHtml += '</tr>'
  })

  table.innerHTML = tableHtml
}

// Enables the user to join a group and in doing so removes the selected group from the display
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
  populateRecommendedGroups(groups)

  document.getElementById('find-groups-table').value = ''
}
