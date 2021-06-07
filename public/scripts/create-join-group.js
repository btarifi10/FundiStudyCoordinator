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

// must replace this 'users' with a get function to the database of all users (user names NOT first names)
const users = ['Albus', 'Snape', 'Ron', 'Luna', 'Harry', 'Hermoie', 'Draco', 'Cho', 'Cedric', 'Voldemort', 'Lockhart', 'Sirius']

const { username } = Qs.parse(location.search, {
  ignoreQueryPrefix: true
})

document.addEventListener('DOMContentLoaded', function () {
  loadHTMLTable(database, username)
  populateUsersList(users)
})

function populateUsersList (users) {
  users.forEach((element, index) => {
    const inviteList = document.getElementById('inviteList')
    const option = document.createElement('option')
    option.text = element
    option.value = index
    inviteList.add(option)
  })
}

// This function refreshes the Table shown. The user can 'Join' groups they are not already in.
function loadHTMLTable (data, username) {
  const table = document.querySelector('table tbody')

  if (data.length === 0) {
    table.innerHTML = "<tr><td class='no-data' colspan='6'>No Data</td></tr>"
  } else {
    let tableHTML = ''

    data.forEach(function ({ groupName, members, admin, startDate }) {
      tableHTML += '<tr>'
      tableHTML += `<td>${groupName}</td>`
      tableHTML += `<td>${members}</td>`
      tableHTML += `<td>${admin}</td>`
      tableHTML += `<td>${startDate.toLocaleString()}</td>`
      const groupName_id = groupName.replace(/\s+/g, '')

      if (admin.find(name => name === username)) { // id's cannot have spaces, so the group name is collapsed to be the button's unique id
        tableHTML += `<td><button class="delete-row-btn" id=${groupName_id}>Delete</td>`
      } else {
        tableHTML += '<td>-</td>'
      }
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
    alert('Please Enter a Valid Group Name. Group Name can only be 30 alphanumerics')
    return
  }

  const inviteList = document.getElementById('inviteList')
  const userinput = document.getElementById('groupName').value.trim()
  const duplicate = database.find(group => group.groupName === userinput)
  const invitedMembers = selectedMembers(inviteList)

  if (duplicate === undefined) {
    const newGroup = {
      groupName: userinput,
      members: [username, invitedMembers],
      admin: [username],
      startDate: new Date()
    }
    database.push(newGroup)
    loadHTMLTable(database, username)
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
  return ((groupName === null) || (groupName.match(/^ *$/) !== null) || (groupName.length > 30))
}
