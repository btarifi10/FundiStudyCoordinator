'use strict'

let database = []
let usersGroups = [] // update this after creating a group

const { username } = Qs.parse(location.search, {
  ignoreQueryPrefix: true
})

document.addEventListener('DOMContentLoaded', function () {
  // Load list of groups user is a member of
  loadUsersGroups()
  // Load group and member data from database to show in table
  loadDatabaseGroups()
  // Load list of usernames to invite
  loadUsersList()
})

function loadDatabaseGroups () {
  fetch('get-groups?username=${username}')
    .then(response => response.json())
    .then(data => data.recordset)
    .then(updateLocalArray)
    .then(loadHTMLTable)
}

function updateLocalArray (db) {
  database = db
  return database
}

function loadUsersList () {
  fetch(`/get-users?username=${username}`)
    .then(response => response.json())
    .then(data => data.recordset)
    .then(populateUsersList)
}

function populateUsersList (users) { // TO DO: Remove the username from the list
// 'users' should have records from database
  users.forEach(element => {
    if (element.username.trim() !== username) {
      const inviteList = document.getElementById('inviteList')
      const option = document.createElement('option')
      option.text = element.username
      option.value = element.user_id
      inviteList.add(option)
    }
  })
}

// Bring list of groups that user is a member of ('memberships' table), and if groupname appears in list
// don't give them a 'join' button
function loadUsersGroups () {
  fetch(`/getUsersGroups?username=${username}`)
    .then(response => response.json())
    .then(data => data.recordset)
    .then(populateUsersGroups)
}

function populateUsersGroups (groups) {
  usersGroups = [...groups]
  console.log(usersGroups)
}

// This function refreshes the Table shown. The user can 'Join' groups they are not already in.
function loadHTMLTable (groupsData) { // TO DO: if username is member, can't get a 'join' button
  const table = document.querySelector('table tbody')
  if (groupsData.length === 0) {
    table.innerHTML = "<tr><td class='no-data' colspan='6'>No Data</td></tr>"
  } else {
    let tableHTML = ''

    groupsData.forEach(element => {
      const { group_name, courseCode, members = ['Everyone'], admin = username, date_created } = element
      tableHTML += '<tr>'
      tableHTML += `<td>${group_name}</td>`
      tableHTML += `<td>${courseCode}</td>`
      tableHTML += `<td>${members}</td>`
      tableHTML += `<td>${admin}</td>`
      tableHTML += `<td>${date_created.toLocaleString()}</td>`
      const groupName_id = group_name.replace(/\s+/g, '')
      // const usersGroups = [21] if usersgroups.contains(group_name)
      let bFound = false
      usersGroups.forEach(group => {
        if (group.group_name === group_name) {
          bFound = true
        }
      })

      if (bFound) {
        tableHTML += '<td>-</td>'
      } else {
        tableHTML += `<td><button class="join-row-btn" id=${groupName_id} onClick="joinGroup(this.id)">Join</td>`
      }

      tableHTML += '</tr>'
    })
    table.innerHTML = tableHTML
  }
}

// This function creates a new group with the required fields. onClick event for 'Create' button
// Update database
// Update array shown in table
function updateGroupList () {
  // Validate the user input first

  if (invalidForm()) {
    alert('Please Enter a Valid Group Name. Group Name can only be 40 alphanumerics')
    return
  }

  const inviteList = document.getElementById('inviteList')
  const userinput = document.getElementById('groupName').value.trim()
  const courseCode = document.getElementById('courseCode').value.trim()
  const duplicate = database.find(group => group.group_name.normalize().trim() === userinput.normalize())
  let invitedMembers = []
  invitedMembers = selectedMembers(inviteList)

  if (duplicate === undefined) {
    const newGroup = {
      group_name: userinput,
      course_code: courseCode,
      // members: [username, invitedMembers],
      // admin: [username],
      date_created: new Date()
    }

    database.push(newGroup) // update the table array
    const allMembers = [...invitedMembers]
    allMembers.push(username) // username and all invited members
    const membershipInfo = { members: allMembers, group_name: userinput, date_created: newGroup.date_created }
    const inviteObj = { invited_members: invitedMembers, group_name: newGroup.group_name, time_sent: newGroup.date_created }
    createGroup(newGroup, membershipInfo)

    // update usersGroups
    usersGroups.push({ group_name: newGroup.group_name })
    console.log(inviteObj)
    sendInvites(inviteObj)

    loadHTMLTable(database)
    clearForm()

    alert(`${userinput} is now a group`)
  } else {
    alert('Please enter a VALID group name, that does NOT already EXIST')
  }
}

function createGroup (newGroup, membershipInfo) { // create 'groups' and 'members' record
  fetch('/createGroup', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(newGroup)
  })
    .then(result => {
      fetch('/createMembership', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(membershipInfo)
      })
    })
}


// This function adds the username to the 'members' list of a particular group
// The button that calls this function only appears to members not in a group, hence no validation
function joinGroup (clicked_id) {
  // 'request has been sent' alert
  // Update the 'groupRequests' table
  // replace 'join' button with '-'

  // add the user to 'memberships' table
  // reload the database

  // const group = database.find(group => group.groupName.replace(/\s+/g, '') === clicked_id) // Can't have groups differing in whitespace only
  // loadHTMLTable(database)
  // loadHTMLTable(database, username)
}


function sendInvites (inviteObj) {
  if (inviteObj.invited_members.length > 0) {
    console.log('function sendInvites')
    fetch('/sendInvites', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(inviteObj)
    })
  }
}

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
    if ((opt.selected === true) && (opt.text.trim() !== username)) {
      invitedMembers.push(opt.text)
    }
  }
  return invitedMembers
}

function clearForm () {
  // clear inputs
  const myForm = document.getElementById('createForm')
  myForm.reset()

  // reset drop down menu
  const userSearch = document.getElementById('userSearch')
  userSearch.value = ''
  userSearch.onkeyup()
}

// Checks for alphanumerical group name from user
function invalidForm () {
  const groupName = document.getElementById('groupName').value
  return ((groupName === null) || (groupName.match(/^ *$/) !== null) || (groupName.length > 40))
}
