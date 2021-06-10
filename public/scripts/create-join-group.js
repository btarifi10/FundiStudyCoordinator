'use strict'

// const { post } = require('../../server/group-routes')

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
    groupName: 'Slytherin',
    members: ['Harry', 'Luna', 'Hermoine', 'BottomLong', 'Snek'],
    admin: ['Snape'],
    startDate: new Date(2019, 8, 28, 12, 30, 30, 0)
  },
  {
    groupName: 'LYFE',
    members: ['Yasser', 'The boys'],
    admin: ['The Mafia'],
    startDate: new Date(2020, 8, 28, 12, 10, 30, 0)
  }
]

// TO DO: must replace this 'users' with a get function to the database of all users (user names NOT first names)

// const users = ['Albus', 'Snape', 'Ron', 'Luna', 'Harry', 'Hermoie', 'Draco', 'Cho', 'Cedric', 'Voldemort', 'Lockhart', 'Sirius']

const { username } = Qs.parse(location.search, {
  ignoreQueryPrefix: true
})

document.addEventListener('DOMContentLoaded', function () {
  // Load group and member data from database to show in table
  loadDatabaseGroups()
  // Load list of usernames to invite
  fetch('/get-users?username=${username}')
    .then(response => response.json())
    .then(data => data.recordset)
    .then(populateUsersList)
})

function loadDatabaseGroups () {
  fetch('get-groups?username=${username}')
    .then(response => response.json())
    .then(data => data.recordset)
    .then(loadHTMLTable)
}

function populateUsersList (users) {
// 'users' should have records from database
  users.forEach(element => {
    const inviteList = document.getElementById('inviteList')
    const option = document.createElement('option')
    option.text = element.username
    option.value = element.user_id
    inviteList.add(option)
  })
}

// This function refreshes the Table shown. The user can 'Join' groups they are not already in.
function loadHTMLTable (groupsData) {
  const table = document.querySelector('table tbody')
  console.log(groupsData)
  if (groupsData.length === 0) {
    table.innerHTML = "<tr><td class='no-data' colspan='6'>No Data</td></tr>"
  } else {
    let tableHTML = ''

    groupsData.forEach(element => {
      const { group_name, course_code, members = ['Everyone'], admin = username, date_created } = element
      tableHTML += '<tr>'
      tableHTML += `<td>${group_name}</td>`
      tableHTML += `<td>${course_code}</td>`
      tableHTML += `<td>${members}</td>`
      tableHTML += `<td>${admin}</td>`
      tableHTML += `<td>${date_created.toLocaleString()}</td>`
      const groupName_id = group_name.replace(/\s+/g, '')

      if (!(members.find(name => name === username))) { // Users cannot join groups they are members of
        tableHTML += `<td><button class="join-row-btn" id=${groupName_id} onClick="joinGroup(this.id)">Join</td>`
      } else {
        tableHTML += '<td>-</td>'
      }

      tableHTML += '</tr>'
    })
    table.innerHTML = tableHTML
  }
}

// This function creates a new group with the required fields. onClick event for 'Create' button
function updateGroupList () {
  // Validate the user input first
  if (invalidForm()) {
    alert('Please Enter a Valid Group Name. Group Name can only be 40 alphanumerics')
    return
  }

  const inviteList = document.getElementById('inviteList')
  const userinput = document.getElementById('groupName').value.trim()
  const courseCode = document.getElementById('courseCode').value.trim()
  const duplicate = database.find(group => group.groupName === userinput)
  const invitedMembers = selectedMembers(inviteList)

  if (duplicate === undefined) {
    const newGroup = {
      groupName: userinput,
      courseCode: courseCode,
      members: [username, invitedMembers],
      admin: [username],
      startDate: new Date()
    }

    database.push(newGroup)
    const { groupName: group_name, courseCode: course_code, startDate: start_date } = newGroup
    createGroupEntry({ group_name, course_code, start_date })
      .then(loadDatabaseGroups())
    // sendInvites(inviteList)
  } else {
    alert('Please enter a VALID group name, that does NOT already EXIST')
  }
}

// This function adds the username to the 'members' list of a particular group
// The button that calls this function only appears to members not in a group, hence no validation
function joinGroup (clicked_id) {
  const group = database.find(group => group.groupName.replace(/\s+/g, '') === clicked_id) // Can't have groups differing in whitespace only
  group.members.push(username)
  loadHTMLTable(database, username)
}

function createGroupEntry (newGroup) {
  fetch('/createGroup', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(newGroup)
  })
}

// function sendInvites (inviteList) {
//   fetch('/sendInvites', {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json'
//     },
//     body: JSON.stringify(inviteList)
//   })
// }

// Search for users in the drop down, and filter drop down accordingly
function userSearch (searchTerm) {
  // Allows both cases to be correctly identified
  const filter = searchTerm.toLowerCase()
  const inviteList = document.getElementById('inviteList')
  for (let i = 0; i < inviteList.length; i++) {
    const text = inviteList.options[i].text
    if (text.toLowerCase().indexOf(filter) > -1) {
      inviteList.options[i].style.display = 'list-item'
    } else {
      inviteList.options[i].style.display = 'none'
    }
  }
}

// This function returns a list of the selected members from a dropdown <select> menu
function selectedMembers (inviteList) {
  const invitedMembers = []
  for (let i = 0; i < inviteList.length; i++) {
    const opt = inviteList.options[i]
    if (opt.selected === true) {
      invitedMembers.push(opt.text)
    }
  }
  clearSelected(inviteList)
  return invitedMembers
}

function clearSelected (inviteList) {
  const elements = inviteList.options
  for (let i = 0; i < elements.length; i++) {
    elements[i].selected = false
  }
}

// Checks for alphanumerical group name from user
function invalidForm () {
  const groupName = document.getElementById('groupName').value
  return ((groupName === null) || (groupName.match(/^ *$/) !== null) || (groupName.length > 40))
}
