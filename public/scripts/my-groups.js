'use strict'

let groups = null

document.addEventListener('DOMContentLoaded', function () {
  retrieveInvites()
})

// Every time the table changes, it will be refreshed
function retrieveInvites () {
  fetch('/membership-views')
    .then(response => response.json())
    .then(data => {
      groups = data.recordset
      loadHTMLTable(groups)
    })
}

function loadHTMLTable (data) {
  const table = document.querySelector('table tbody')
  if (data.length === 0) {
    table.innerHTML = "<tr><td class='no-data' colspan='4'>No Memberships</td></tr>"
    return
  }

  let tableHtml = ''

  data.forEach(function ({ membership_id, group_id, group_name, course_code, date_joined }) { // group_num, group_online, group_url }) {
    tableHtml += '<tr>'
    tableHtml += `<td id = '${group_id}-group-name'><a href='/chat?group=${group_name.trim()}'>${group_name}</a></td>`
    tableHtml += `<td id = '${group_id}-course-code'>${course_code}</td>`
    tableHtml += `<td id = '${group_id}-date-joined'>${moment(date_joined).format('ddd, DD MMM YYYY')}</td>`
    tableHtml += `<td><button class="btn btn-outline-danger border-0 delete-row-btn" style="border-radius:25px;width:60px" id="${membership_id}-btn" data-id=${membership_id} onclick="leaveGroup(this.dataset.id)">
    <i class="bi bi-box-arrow-right"></i></td>`
    tableHtml += '</tr>'
  })
  table.innerHTML = tableHtml

  // document.getElementsByClassName('delete-row-btn').addEventListener('click', function (event) {
  //   leaveGroup(event.target.dataset.id)
  // })
}

window.leaveGroup = leaveGroup
function leaveGroup (membership_id) {
  fetch('/delete/' + membership_id, {
    method: 'DELETE'
  })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        location.reload()
      }
    })
}
