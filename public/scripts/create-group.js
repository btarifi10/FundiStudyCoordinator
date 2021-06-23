'use strict'

import { addAction } from './action-log.js'

const userList = document.getElementById('user-list')
const addedUsers = document.getElementById('added-users')

const invitedMembers = []
let users = null
const existingGroups = [] // stores list of { groupname: TheGroupName }, to check for duplicates
let membershipNum = null // to limit user to membership of 10 groups

document.addEventListener('DOMContentLoaded', function () {
  loadUsersList()
  loadExistingGroups()
  loadMembershipNum()
})

function loadUsersList () {
  fetch('/get-users')
    .then(response => response.json())
    .then(data => data.recordset)
    .then(data => {
      users = data
      populateUsersList(users)
    })
}

function populateUsersList (users) {
  userList.innerHTML = ''
  users.forEach(element => {
    const option = document.createElement('option')
    option.text = element.username
    option.value = element.user_id
    userList.add(option)
  })
}

function loadExistingGroups () {
  fetch('/get-groups')
    .then(response => response.json())
    .then(data => data.recordset)
    .then(data => {
      data.forEach(group => {
        const groupName = group.group_name.trim()
        existingGroups.push(groupName)
      })
    })
}

function loadMembershipNum () {
  fetch('/membership-views')
    .then(response => response.json())
    .then(data => {
      const groups = data.recordset
      membershipNum = groups.length
    })
}

document.getElementById('search').addEventListener('keyup', userSearch)
function userSearch () {
  const searchTerm = document.getElementById('search').value.toLowerCase()

  if (searchTerm) {
    const matchingUsers = users.filter(u => u.username.toLowerCase().includes(searchTerm))
    populateUsersList(matchingUsers)
  } else { populateUsersList(users) }
}

document.getElementById('addUsers').addEventListener('click', addUsers)
function addUsers () {
  selectedMembers()

  addedUsers.innerHTML = `
  ${invitedMembers.map(member => `<li class="list-group-item">${member.username}</li>`).join('')}`
}

function selectedMembers () {
  for (let i = 0; i < userList.length; i++) {
    const opt = userList.options[i]
    const user = { username: opt.text, user_id: opt.value }
    if ((opt.selected) && !invitedMembers.includes(user)) {
      invitedMembers.push(user)
    }
  }
}

document.getElementById('createGroup').addEventListener('click', createGroup)
function createGroup () {
  const groupName = document.getElementById('group-name').value.trim()
  const courseCode = document.getElementById('course-code').value

  if ((groupName === null) || (groupName.match(/^ *$/) !== null) || (groupName.length > 40)) {
    alert('Please enter a valid group name')
    return
  }

  if (existingGroups.includes(groupName)) {
    alert('This group already exists')
    return
  }

  if (membershipNum >= 10) {
    alert('You cannot become a member of more than 10 groups')
    return
  }

  if (invitedMembers.length === 0) {
    alert('Please select at least one member')
    return
  }

  const dateCreated = moment()
  saveGroup({ groupName, courseCode, invitedMembers, dateCreated })

  // Record the 'CREATED' and 'INVITE' actions
  addAction({ action: 'CREATED', groupName: groupName, timestamp: dateCreated, description: `'${groupName}' was created` })
  let actionString = `Members invited to join '${groupName}': `
  invitedMembers.forEach(member => { actionString += member.username + ', ' })
  addAction({ action: 'INVITE', groupName: groupName, timestamp: dateCreated, description: actionString })

  existingGroups.push(groupName)
  membershipNum += 1
  alert(`Group ${groupName} is now created`)
}

function saveGroup (groupInfo) {
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
    .then(() => {
      const actionObj = { group_name: groupInfo.groupName, description: 'CREATED' }
      addAction(actionObj)
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
