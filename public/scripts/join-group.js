'use strict'

const database = [
  {
    groupName: 'Software',
    members: ['Yasser', 'Nathan', 'Tarryn', 'Taliya', 'Basheq'],
    admin: ['Yasser'],
    startDate: new Date(2018, 11, 24, 10, 33, 30, 0)// year, month, day, hour, minute, second, and millisecond (in that order):
  },
  {
    groupName: 'Big Data',
    members: ['Yasser', 'Nathan', 'Tarryn', 'Taliya', 'Basheq'],
    admin: ['Basheq'],
    startDate: new Date(2019, 8, 28, 12, 30, 30, 0)
  },
  {
    groupName: 'LYFE',
    members: ['Yasser', 'The boys'],
    admin: ['The Gang'],
    startDate: new Date(2020, 8, 28, 12, 10, 30, 0)
  }
]

document.addEventListener('DOMContentLoaded', function () {
  loadHTMLTable(database)
})

function loadHTMLTable (data) {
  const table = document.querySelector('table tbody')

  if (data.length === 0) {
    table.innerHTML = "<tr><td class='no-data' colspan='4'>No Data</td></tr>"
  } else {
    let tableHTML = ''

    data.forEach(function ({ groupName, members, admin, startDate }) {
      tableHTML += '<tr>'
      tableHTML += `<td>${groupName}</td>`
      tableHTML += `<td>${members}</td>`
      tableHTML += `<td>${admin}</td>`
      tableHTML += `<td>${startDate.toLocaleString()}</td>`
      const groupName_id = groupName.replace(/\s+/g, '')
      tableHTML += `<td><button class="join-row-btn" id=${groupName_id} onClick="joinGroup(this.id)">Join</td>`
      tableHTML += '</tr>'
    })
    table.innerHTML = tableHTML
  }
}

function joinGroup (clicked_id) {
  const { username } = Qs.parse(location.search, {
    ignoreQueryPrefix: true
  })
  const list = document.getElementById('group-clicked')

  const group = database.find(group => group.groupName.replace(/\s+/g, '') === clicked_id) // Can't have groups differing in whitespace only
  const memberExists = group.members.find(e => e === username)
  if (memberExists === undefined) {
    group.members.push(username)
    loadHTMLTable(database)
  } else {
    alert('You cannot join a group you are already in')
  }
}
