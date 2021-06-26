'use strict'
let groups = []
let taggedGroups = []
let tags = []
let tempValue = []

document.addEventListener('DOMContentLoaded', function () {
  fetch('/get-other-groups')
    .then(response => response.json())
    .then(data => {
      groups = data
      populateAllGroups(groups)
    })

  getTags()
})

// Function to get all the tags of the users current groups
function getTags () {
  fetch('/get-tags')
    .then(response => response.json())
    .then(data => {
      tags = data.recordset
    })
}

// ?nameSelected=${nameSelected}

function getTagGroups (tag) {
  fetch(`/get-matched-terms?tag=${tag}`)
    .then(response => response.json())
    .then(data => {
      tempValue = data
    })

  taggedGroups.push(tempValue)
}

// Enables a user to search using either the group name or the subject associated with the group
function entireGroupSearch () {
  const searchTermGroup = document.getElementById('group-search').value.toLowerCase()

  if (searchTermGroup) {
    // Search via current groups names
    const matchingGroups = groups.filter(g => g.group_name.toLowerCase().includes(searchTermGroup))
    // const tagValue = tags.filter(t => t.tag.toLowerCase().includes(searchTermGroup))
    // if (tagValue.length === 0) {
    //   taggedGroups = []
    // } else {
    //   tagValue.forEach(t => getTagGroups(t.tag))
    }
    // tagValue.forEach(t => getTagGroups(t)
    // console.log(t))

    // const overallGroups = matchingGroups.concat(matchingGroups)
    // console.log(overallGroups)

    // const displayGroups = []
    // overallGroups.forEach((c) => {
    //   if (!displayGroups.includes(c)) {
    //     displayGroups.push(c)
    //   }
    // })
    // console.log(displayGroups)
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
    id="${group_id}-btn" data-id=${group_id} onclick="joinGroup(this.dataset.id)" data-cy="join-btn">
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

  alert(`A Request to join '${groups[gId].group_name.trim()}' has been sent`)

  groups.splice(gId, 1)

  populateAllGroups(groups)
  document.getElementById('group-search').value = ''
}
