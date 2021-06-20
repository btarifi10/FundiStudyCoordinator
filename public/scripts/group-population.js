'use strict'

function populateAllGroups (data, fx) {
  console.log(data)
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
      id="${group_id}-btn" data-id=${group_id} onclick="${fx}(this.dataset.id)">
            <i class="bi bi-plus-square"></i></td>`
    tableHtml += '</tr>'
  })
  table.innerHTML = tableHtml

}

function joinGroup (_groupId) {

  console.log(_groupId)
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
  return groupId

  //   const gId = groups.findIndex(g => g.group_id === groupId)
  //   console.log(gId)

  //   alert(`A Request to join ${groups[gId].group_name.trim()} has been sent`)

  //   groups.splice(gId, 1)

//   populateAllGroups(groups)
//   document.getElementById('group-search').value = ''
}

export {
  populateAllGroups,
  joinGroup

}
