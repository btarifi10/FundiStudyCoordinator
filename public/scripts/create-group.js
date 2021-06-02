'use strict'
// array of group objects: group name, member names, and date
// when group added, show in a table
// button clicked = sjows form for filling in group details
// also add a dummy button for 'invite other students'
/// //////////////////////////////////////////////////////
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
    admin: ['The Mafia'],
    startDate: new Date(2020, 8, 28, 12, 10, 30, 0)
  }
]

document.addEventListener('DOMContentLoaded', function () {
  loadHTMLTable(database)
})

function loadHTMLTable (data) {
  const table = document.querySelector('table tbody')
  const { username } = Qs.parse(location.search, {
    ignoreQueryPrefix: true
  })

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
      if (admin.find(name => name === username)) {
        tableHTML += `<td><button class="delete-row-btn" data-id=${groupName}>Delete</td>`
      }
      tableHTML += '</tr>'
    })
    table.innerHTML = tableHTML
  }
}

function updateGroupList () {
  const { username } = Qs.parse(location.search, {
    ignoreQueryPrefix: true
  })
  const inviteList = document.getElementById('inviteList')
  const userinput = document.getElementById('groupName').value
  const duplicate = database.find(group => group.groupName === userinput)

  const invitedMembers = []
  let i
  for (i = 0; i < inviteList.length; i++) {
    const opt = inviteList.options[i]
    if (opt.selected === true) {
      invitedMembers.push(opt.text)
    }
  }

  if (duplicate === undefined) {
    const newGroup = {
      groupName: userinput,
      members: [username, invitedMembers],
      admin: [username],
      startDate: new Date()
    }
    database.push(newGroup)
    loadHTMLTable(database)
  } else {
    alert('Please enter a VALID group name, that does NOT already EXIST')
  }
}
