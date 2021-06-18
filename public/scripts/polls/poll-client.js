'use strict'

import { UserService } from '../UserService.js'

const userService = UserService.getUserServiceInstance()
let user = null

/* ------------------------------ DOM Elements ------------------------------ */

const currentPollArea = document.getElementById('current-poll-area')

/* ------------------------------ Poll Service ------------------------------ */

// Retrieve the username and group name from the URL

const group = Qs.parse(location.search, {
  ignoreQueryPrefix: true
}).group

// Once the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  userService.getCurrentUser().then(u => {
    user = u
    socket.emit('voterConnection', group)
  })
  getGroupRequests(group)
    .then(data => {
      requests = data
      updateRequestsTable(requests)
    })

  getGroupMembers(group)
    .then(data => {
      groupMembers = data.filter(mem => mem.user_id !== user.id)
      updateMembersTable(groupMembers)
    })
})
// Create the client socket
const socket = io()

socket.on('updateCurrentPolls', (polls) => {
  displayCurrentPolls(polls)
})

/* ---------------------------------------------- */

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

function formatPollHTML (poll, pollId) {
  let pollFormHtml = ''
  let numOptions = 0

  const userVoted = poll.voters.includes(user.id)

  pollFormHtml += `
  <div class="poll-content col-md-6">  
  <div class="poll-form">
  `

  if (userVoted) { pollFormHtml += '<p> You have already voted in this poll </p>' } else {
    poll.options.forEach(opt => {
      pollFormHtml += `
    <div class="form-check poll-option">
        <input class="form-check-input" type="radio" name="poll-${pollId}-option"
        value="${numOptions}" id="poll-${pollId}-option${numOptions}">
        <label class="form-check-label" for="poll-${pollId}-option${numOptions}">${opt.option}</label>
    </div>
      `
      numOptions = numOptions + 1
    })

    pollFormHtml += `
        <hr>
        <div>
        <button class="btn btn-primary" id="${pollId}-btn" onclick="vote(this.id)"> Vote </button>
        </div>
        `
  }
  pollFormHtml += '</div></div>'

  const div = document.createElement('div')
  div.classList.add('poll')
  div.classList.add('card')
  div.classList.add('text-start')
  div.innerHTML =
      `<div class="card-header poll-title"> ${poll.title} <span class="badge bg-secondary"> ${poll.type.toUpperCase()} </span> </div>
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

function vote (selectedPollId) {
  const pid = parseInt(selectedPollId)
  const radioName = `poll-${pid}-option`
  const optionSelected = document.querySelector(`input[name="${radioName}"]:checked`).value

  const voteBody = { userId: user.id, pollId: pid, option: optionSelected }
  socket.emit('vote', voteBody)
}
window.vote = vote

function updatePollChart (poll, pollId) {
  const ctx = document.getElementById(`vote-chart-${pollId}`).getContext('2d')
  /*
 const data = {
  labels: [
    'Red',
    'Blue',
    'Yellow'
  ],
  datasets: [{
    label: 'My First Dataset',
    data: [300, 50, 100],
    backgroundColor: [
      'rgb(255, 99, 132)',
      'rgb(54, 162, 235)',
      'rgb(255, 205, 86)'
    ],
    hoverOffset: 4
  }]
 */

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
    options: {

    }
  })
  chart.update()
}

/* ---------------------- Group Request Things --------------------------- */

let requests = null
let groupMembers = null

function getGroupRequests (g) {
  return fetch(`/api/get-group-requests?group=${g}`)
    .then(response => response.json())
}

function getGroupMembers (group) {
  return fetch(`/api/get-group-members?group=${group}`)
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
      tableHTML += `<td>${time_sent.toLocaleString()}</td>`
      tableHTML += `<td><button class="btn btn-secondary" id="${requests_id}-request" onClick="startRequestsPoll(this.id)"> Start Poll </td>`

      tableHTML += '</tr>'
    })
    table.innerHTML = tableHTML
  }
}

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
      tableHTML += `<td><button class="btn btn-secondary" id="${user_id}-member" onClick="startBanPoll(this.id)"> Ban</td>`
      tableHTML += '</tr>'
    })
    table.innerHTML = tableHTML
  }
}

function startRequestsPoll (id) {
  const reqId = parseInt(id)

  const request = requests.find(r => r.requests_id === reqId)

  const hrs = 1 / 120
  const details = {
    requestId: request.requests_id,
    userId: request.user_id,
    username: request.username,
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
      socket.emit('pollCreated', group)
    }
  })
}
window.startRequestsPoll = startRequestsPoll

function startBanPoll (id) {
  const userId = parseInt(id)

  const member = groupMembers.find(m => m.user_id === userId)

  const hrs = 48
  const details = {
    userId: userId,
    userName: member.userId,
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
    }
  })
}
window.startBanPoll = startBanPoll
