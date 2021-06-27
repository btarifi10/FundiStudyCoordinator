'use strict'

import { UserService } from '../user-service.js'

/* ------------------------------ Variables ----------------------------------- */
const userService = UserService.getUserServiceInstance()
let user = null
let requests = null
let groupMembers = null

let usersToInvite = null

/* ------------------------------ DOM Elements ------------------------------ */

const currentPollArea = document.getElementById('current-poll-area')
const historyPollArea = document.getElementById('old-poll-area')

/* ------------------------------ Poll Service ------------------------------ */

// Retrieve the group name from the URL

const group = Qs.parse(location.search, {
  ignoreQueryPrefix: true
}).group

// Once the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Get the current user
  document.getElementById('back-button').href = `/chat?group=${group}`

  userService.getCurrentUser().then(u => {
    user = u
    socket.emit('voterConnection', group)
    return getGroupMembers(group)
    // Get all group members and display the data
  }).then(data => {
    groupMembers = data.filter(mem => mem.user_id !== user.id)
    // console.log(groupMembers)
    updateMembersTable(groupMembers)
  })

  getPollHistory(group)
    .then(pollHistory => displayPollHistory(pollHistory))

  // Get all group requests and then display the data
  getGroupRequests(group)
    .then(data => {
      requests = data
      updateRequestsTable(requests)
    })

  getUsersToInvite(group)
    .then(data => {
      usersToInvite = data
      updateUserInvitesTable([], '')
    })
})

// Create the client socket
const socket = io()

/* -------------------------- Socket IO Handling --------------------------------------- */
// Allows for real time handling of polls (If people update the vote, for example)

// Update all the polls while filtering polls specific to banning the user
socket.on('updateCurrentPolls', (polls) => {
  // console.log('updatemsg')
  // console.log(polls)
  const myPolls = polls.filter(poll => (poll.type !== 'Ban' || poll.userId !== user.id))
  displayCurrentPolls(myPolls)
})

// Given a poll Id, vote for the selected option
function vote (selectedPollId) {
  const pid = parseInt(selectedPollId)
  const radioName = `poll-${pid}-option`
  const optionSelected = document.querySelector(`input[name="${radioName}"]:checked`).value

  if (optionSelected === null) {
    window.alert('Please select an option before voting')
    return
  }

  const voteBody = { userId: user.id, pollId: pid, option: optionSelected }
  socket.emit('vote', voteBody)
}
window.vote = vote

/* ------------------------ Functions to do with the Active Polls Area ------------------------ */

// Format and add each poll to the area (each time)
// TODO: Make this more efficient
function displayCurrentPolls (polls) {
  currentPollArea.innerHTML = ''
  polls.forEach(poll => {
    const outerDiv = document.createElement('div')
    outerDiv.classList.add('text-center')
    outerDiv.classList.add('poll-container')
    outerDiv.appendChild(formatPollHTML(poll, poll.pollId))
    currentPollArea.appendChild(outerDiv)

    updatePollChart(poll, poll.pollId)
  })
}

// Format the poll with HTML
function formatPollHTML (poll, pollId) {
  let pollFormHtml = ''
  let numOptions = 0

  const userVoted = poll.voters.includes(user.id)
  // Div for the poll info
  pollFormHtml += `
  <div class="poll-content col-md-6">  
  <div class="poll-form">
  `
  if (userVoted) {
    pollFormHtml += `
    <p> You have already voted in this poll </p>
    <hr>
    <span class="text-end small"> Ends ${moment(poll.date).add(poll.duration * 3600, 's').format('ddd DD MMM YYYY, H:mm')}</span>`
  } else {
    poll.options.forEach(opt => {
      pollFormHtml += `
    <div class="form-check poll-option">
        <input class="form-check-input" type="radio" name="poll-${pollId}-option"
        value="${numOptions}" id="poll-${pollId}-option${numOptions}" data-cy="opt-${numOptions}">
        <label class="form-check-label" for="poll-${pollId}-option${numOptions}">${opt.option}</label>
    </div>
      `
      numOptions = numOptions + 1
    })

    pollFormHtml += `
        <hr>
        <div>
        <button class="btn btn-primary" style="border-radius:25px;width:100px" id="${pollId}-btn" onclick="vote(this.id)">
        <i class="far fa-check-circle"></i> Vote </button>
        <span class="text-end small"> Ends ${moment(poll.date).add(poll.duration * 3600, 's').format('ddd DD MMM YYYY, H:mm')}</span>
        </div>
        `
  }
  pollFormHtml += '</div></div>'

  const div = document.createElement('div')
  div.classList.add('poll')
  div.classList.add('card')
  div.classList.add('text-start')
  div.innerHTML =
      `<div class="card-header poll-title"> ${poll.title.trim()} <span class="badge bg-secondary"> ${poll.type.toUpperCase()} </span> </div>
       <div class="card-body">
       <div class="row">
       ${pollFormHtml}
       <div class="col-md-6">
        <canvas id="vote-chart-${pollId}"></canvas>
      </div>
      </div>
      </div>
      `

  return div
}

// Update the charts
function updatePollChart (poll, pollId) {
  const ctx = document.getElementById(`vote-chart-${pollId}`).getContext('2d')

  const chartData = {
    labels: [],
    datasets: [{
      data: [],
      backgroundColor: []
    }]
  }

  poll.options.forEach(opt => {
    chartData.labels.push(opt.option)
    chartData.datasets[0].data.push(opt.votes)
    chartData.datasets[0].backgroundColor.push(opt.color)
  })

  const chart = new Chart(ctx, {
    type: 'doughnut',
    data: chartData,
    options: { }
  })
  chart.update()
}

/* ---------------------- Functions to do with Poll History -------------------------- */

function getPollHistory (group) {
  return fetch(`/api/get-poll-history?group=${group}`)
    .then(res => res.json())
}

function displayPollHistory (polls) {
  historyPollArea.innerHTML = ''
  let numOldPolls = 0
  polls.forEach(poll => {
    const outerDiv = document.createElement('div')
    outerDiv.classList.add('text-center')
    outerDiv.classList.add('poll-container')
    outerDiv.appendChild(formatOldPollHTML(poll, numOldPolls))
    historyPollArea.appendChild(outerDiv)

    updateOldPollChart(poll, numOldPolls)
    numOldPolls = numOldPolls + 1
  })
}

function formatOldPollHTML (poll, oldId) {
  const div = document.createElement('div')
  div.classList.add('poll')
  div.classList.add('card')
  div.classList.add('text-start')
  div.innerHTML =
      `<div class="card-header poll-title"> ${poll.title} <span class="badge bg-secondary"> ${poll.type.toUpperCase()} </span> </div>
       <div class="card-body">
       <div class="row">
       <div class="col-md-6">
       <div>
        <div class="w100">
        <strong>Outcome:</strong> ${poll.outcome}
        <hr>
        </div>
        <div class="w100">
        <span class="small"> Ended ${moment(poll.date).add(poll.duration * 3600, 's').format('ddd, DD MMM YYYY, H:mm')}</span>
        </div>
        </div>
       </div>
       <div class="col-md-6">
        <canvas id="vote-chart-old-${oldId}"></canvas>
      </div>
      </div>
      </div>
      `

  return div
}

// Update the charts
function updateOldPollChart (poll, oldId) {
  const ctx = document.getElementById(`vote-chart-old-${oldId}`).getContext('2d')

  const chartData = {
    labels: [],
    datasets: [{
      data: [],
      backgroundColor: []
    }]
  }

  poll.options.forEach(opt => {
    chartData.labels.push(opt.option)
    chartData.datasets[0].data.push(opt.votes)
    chartData.datasets[0].backgroundColor.push(opt.color)
  })

  const chart = new Chart(ctx, {
    type: 'doughnut',
    data: chartData,
    options: { }
  })
  chart.update()
}

/* ---------------------- Functions to do with the group requests ------------------- */

const fetch = window.fetch

// Call the backend to retrieve the requests
// Note this returns a promise
function getGroupRequests (groupName) {
  return fetch(`/api/get-group-requests?group=${groupName}`)
    .then(response => response.json())
}

function updateRequestsTable (requestList) {
  const table = document.querySelector('#group-requests-table tbody')

  if (requestList.length === 0) {
    table.innerHTML = "<tr><td class='no-data' colspan='3'>No Requests</td></tr>"
  } else {
    let tableHTML = ''

    // Display details for each invite
    requestList.forEach(function ({ requests_id, user_id, username, time_sent }) {
      tableHTML += '<tr>'
      tableHTML += `<td>${username}</td>`
      tableHTML += `<td>${moment(time_sent).format('ddd, DD MMM YYYY')}</td>`
      tableHTML += `<td><button class="btn btn-secondary" style="border-radius:25px;width:100px" id="${requests_id}-request"
      onClick="startRequestsPoll(this.id)" data-cy="accept-${username.trim()}-btn"> <i class="fas fa-user-check"></i> Accept </td>`

      tableHTML += '</tr>'
    })
    table.innerHTML = tableHTML
  }
}

function startRequestsPoll (id) {
  const reqId = parseInt(id)

  const request = requests.find(r => r.requests_id === reqId)

  const hrs = 2 / 60 // 120 seconds, just for testing
  const details = {
    requestId: request.requests_id,
    userId: request.user_id,
    username: request.username,
    date: new Date(),
    group: group,
    duration: hrs
  }

  fetch('/api/start-requests-poll', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(details)
  }).then(response => {
    if (response.ok) {
      requests.splice(requests.indexOf(request))
      updateRequestsTable(requests)
      window.alert('The poll has been successfully created.')
      socket.emit('pollCreated', group)
    }
  })
}
window.startRequestsPoll = startRequestsPoll

/* ------------------------------ Functions to do with the banning ------------------- */

// Call the backend to retrieve the group members
function getGroupMembers (group) {
  return fetch(`/api/get-group-members?group=${group}`)
    .then(response => response.json())
}

// Update the view
function updateMembersTable (members) {
  const table = document.querySelector('#group-members-table tbody')

  if (members.length === 0) {
    table.innerHTML = "<tr><td class='no-data' colspan='2'>No other members</td></tr>"
  } else {
    let tableHTML = ''

    // Display details for each invite
    members.forEach(function ({ user_id, username }) {
      tableHTML += '<tr>'
      tableHTML += `<td>${username}</td>`
      tableHTML += `<td><button class="btn btn-secondary" style="border-radius:25px;width:100px" id="${user_id}-member"
      onClick="startBanPoll(this.id)" data-cy="ban-${username.trim()}-btn"> <i class="fas fa-user-minus"></i> Ban </td>`
      tableHTML += '</tr>'
    })
    table.innerHTML = tableHTML
  }
}

// Start the banning poll
function startBanPoll (id) {
  const userId = parseInt(id)

  const member = groupMembers.find(m => m.user_id === userId)

  const hrs = 48
  const details = {
    userId: userId,
    username: member.username,
    date: new Date(),
    group: group,
    duration: hrs
  }

  fetch('/api/start-banning-poll', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(details)
  }).then(response => {
    if (response.ok) {
      socket.emit('pollCreated', group)
      window.alert(`The poll to ban ${member.username.trim()} has been successfully created.`)
    }
  })
}
window.startBanPoll = startBanPoll

/* ------------------- Functions to do with inviting ----------------------- */

function getUsersToInvite (group) {
  return fetch(`/api/get-users-to-invite?group=${group}`)
    .then(response => response.json())
}

window.userSearch = userSearch
function userSearch () {
  const searchTerm = document.getElementById('user-search').value.toLowerCase()
  if (searchTerm) {
    const matchingUsers = usersToInvite.filter(u => u.username.toLowerCase().includes(searchTerm))
    updateUserInvitesTable(matchingUsers)
  } else { updateUserInvitesTable([], searchTerm) }
}

function updateUserInvitesTable (users, searchTerm) {
  const table = document.querySelector('#users-table tbody')

  if (users.length === 0) {
    let message = ''
    if (searchTerm === '' || searchTerm === null) { message = 'Start typing to see users...' } else { message = 'No matching users' }
    table.innerHTML = `<tr><td class='no-data' colspan='2'>${message}</td></tr>`
  } else {
    let tableHTML = ''

    // Display details for each users
    users.forEach(function ({ user_id, username }) {
      tableHTML += '<tr>'
      tableHTML += `<td>${username}</td>`
      tableHTML += `<td><button class="btn btn-success" id="${user_id}-member" style="border-radius:25px;width:100px"
      onClick="startInvitesPoll(this.id)" data-cy="invite-${username.trim()}-btn"> <i class="fas fa-user-plus"></i> Invite </td>`
      tableHTML += '</tr>'
    })
    table.innerHTML = tableHTML
  }
}

// Start the invite poll
function startInvitesPoll (id) {
  const userId = parseInt(id)

  const user = usersToInvite.find(u => u.user_id === userId)

  const hrs = 1 / 60
  const details = {
    userId: userId,
    username: user.username,
    date: new Date(),
    group: group,
    duration: hrs
  }

  fetch('/api/start-invites-poll', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(details)
  }).then(response => {
    if (response.ok) {
      usersToInvite.splice(usersToInvite.indexOf(user))
      updateUserInvitesTable([], '')
      document.getElementById('user-search').value = ''
      socket.emit('pollCreated', group)
      window.alert(`The poll to invite ${user.username.trim()} has been successfully created.`)
    }
  })
}
window.startInvitesPoll = startInvitesPoll

/* --------------------------- Functions to do with custom polls ------------------- */

let numOptions = null

window.addOptionFields = addOptionFields
function addOptionFields () {
  numOptions = document.getElementById('new-poll-num-options').value
  const optionsDiv = document.getElementById('new-poll-options')
  optionsDiv.innerHTML = ''

  for (let i = 0; i < numOptions; i = i + 1) {
    const div = document.createElement('div')
    div.classList.add('mb-3')
    div.classList.add('poll-option')
    div.innerHTML = `
    <input type="text" class="form-control" id="poll-option-${i}" data-cy="new-option-${i}" placeholder="Option ${i + 1}..." required>
    `
    optionsDiv.appendChild(div)
  }
}

window.createCustomPoll = createCustomPoll
function createCustomPoll () {
  const pollTitle = document.getElementById('new-poll-title').value
  const duration = document.getElementById('new-poll-duration').value

  if (!pollTitle || !pollTitle.replace(/\s/g, '').length) {
    window.alert('Please give the poll a valid title.')
    return
  }

  if (!duration || duration <= 0) {
    window.alert('Please give the poll a valid duration.')
    return
  }

  let optInvalid = false
  const pollOptions = []
  for (let i = 0; i < numOptions; i = i + 1) {
    const opt = document.getElementById(`poll-option-${i}`).value
    if (!opt || !opt.replace(/\s/g, '').length) { optInvalid = true }
    pollOptions.push(opt)
  }

  if (optInvalid || !numOptions) {
    window.alert('Please fill in all option fields.')
    return
  }

  const pollDetails = {
    title: document.getElementById('new-poll-title').value,
    group: group,
    //   userId: user.userId,
    date: new Date(),
    duration: document.getElementById('new-poll-duration').value,
    options: pollOptions
  }

  fetch('/api/start-custom-poll', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(pollDetails)
  }).then(response => {
    if (response.ok) {
      socket.emit('pollCreated', group)
      window.alert('The poll has been successfully created.')
    }
  })
}
