'use strict'

const userList = document.getElementById('user-list')
const addedUsers = document.getElementById('added-users')

const invitedMembers = []
let users = null

document.addEventListener('DOMContentLoaded', function () {
  loadUsersList()
})

function loadUsersList() {
  fetch('/get-users')
    .then(response => response.json())
    .then(data => data.recordset)
    .then(data => {
      users = data
      populateUsersList(users)
    })
}

function populateUsersList(users) {
  userList.innerHTML = ''
  users.forEach(element => {
    const option = document.createElement('option')
    option.text = element.username
    option.value = element.user_id
    userList.add(option)
  })
}

function userSearch() {
  const searchTerm = document.getElementById('search').value.toLowerCase()

  if (searchTerm) {
    const matchingUsers = users.filter(u => u.username.toLowerCase().includes(searchTerm))
    populateUsersList(matchingUsers)
  } else { populateUsersList(users) }
}

function addUsers() {
  selectedMembers()

  addedUsers.innerHTML = `
  ${invitedMembers.map(member => `<li class="list-group-item">${member.username}</li>`).join('')}`
}

function selectedMembers() {
  for (let i = 0; i < userList.length; i++) {
    const opt = userList.options[i]
    const user = { username: opt.text, user_id: opt.value }
    if ((opt.selected) && !invitedMembers.includes(user)) {
      invitedMembers.push(user)
    }
  }
}

function createGroup() {
  const groupName = document.getElementById('group-name').value
  const courseCode = document.getElementById('course-code').value

  if (groupName === '') {
    alert('Please enter a group name')
    return
  }

  if (invitedMembers.length === 0) {
    alert('Please select at least one member')
    return
  }

  // TODO - Yasser please check that they don't create duplicate group names...
  const dateCreated = moment()
  saveGroup({ groupName, courseCode, invitedMembers, dateCreated })
}

function saveGroup(groupInfo) {
  fetch('/createGroup', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(groupInfo)
  })
    .then(result => {
      fetch('/complete-group-creation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(groupInfo)
      })
    })
    // TODO - Provide alert for success/failure
    // .then(resp => {
    //   if (resp.ok) {
    //     alert('Group created successfully!')
    //   }
    // })
  // .then(result => {
  //   if (inviteObj.invited_members.length > 0) {
  //     console.log('function sendInvites')
  //     fetch('/sendInvites', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json'
  //       },
  //       body: JSON.stringify(inviteObj)
  //     })
  //   }
  // })
}
