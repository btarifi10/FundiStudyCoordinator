'use strict'

// Dummy objects (will be retrieved from database)
const actions = ['POLL', 'INVITE', 'MEETING', 'MESSAGE', 'SCREENING', 'CREATED', 'ENTER', 'LEAVE']

const members = ['Nathan Jones', 'Taliya Weinstein', 'Yasser Karam', 'Basheq Tarifi', 'Tarryn Maggs']

const time = moment()

const logEntries = [
  {
    action: actions[0],
    timestamp: moment(time).add(1, 's'),
    username: members[0],
    description: `This is the description for the ${actions[0]}. Contains the word flowing water`
  },
  {
    action: actions[1],
    timestamp: moment(time).add(2, 's'),
    username: members[1],
    description: `This is the description for the ${actions[1]}. Contains the word sheer cliff`
  },
  {
    action: actions[0],
    timestamp: moment(time).add(3, 's'),
    username: members[2],
    description: `This is the description for the ${actions[2]}. Contains the word sheep`
  },
  {
    action: actions[3],
    timestamp: moment(time).add(4, 's'),
    username: members[3],
    description: `This is the description for the ${actions[3]}. Contains the word cow`
  },
  {
    action: actions[4],
    timestamp: moment(time).add(5, 's'),
    username: members[4],
    description: `This is the description for the ${actions[4]}. Contains the word passed COVID SCREENING`
  },
  {
    action: actions[2],
    timestamp: moment(time).add(6, 's'),
    username: members[0],
    description: `This is the description for the ${actions[2]}. Contains the word flower`
  }
]

/* ------------------------------ DOM Elements ------------------------------ */

const actionFilter = document.getElementById('action-filter')
const memberFilter = document.getElementById('member-filter')
const descriptionSearch = document.getElementById('description-search')
const timestampFilter = document.getElementById('timestamp-filter')
const logAccordion = document.getElementById('log-entries')

/* --------------------------------- Setup --------------------------------- */

// Filter selections
let selectedAction = 'All Actions'
let selectedMember = 'All Members'
let searchedDescription = ''
let selectedTimeSort = 'Newest'

// Page load event
document.addEventListener('DOMContentLoaded', function () {
  // TODO - Add fetch to database here...
  populateActionFilter(actions)
  populateMemberFilter(members)
  populateLog(logEntries)
})

/* ----------------------------- Filter Events ----------------------------- */

actionFilter.addEventListener('change', (event) => {
  selectedAction = event.target.value
  populateLog(logEntries)
})

memberFilter.addEventListener('change', (event) => {
  selectedMember = event.target.value
  populateLog(logEntries)
})

descriptionSearch.addEventListener('input', (event) => {
  searchedDescription = event.target.value.toLowerCase()
  populateLog(logEntries)
})

timestampFilter.addEventListener('change', (event) => {
  selectedTimeSort = event.target.value
  populateLog(logEntries)
})

/* -------------------------- Populating Functions -------------------------- */

// Used to populate the action filter with all the possible actions from the database
function populateActionFilter (actions) {
  actions.forEach(action => {
    const option = document.createElement('option')
    option.value = action
    option.appendChild(document.createTextNode(`${action}`))
    actionFilter.appendChild(option)
  })
}

// Used to populate the member filter with all the members in the group
function populateMemberFilter (members) {
  members.forEach(member => {
    const option = document.createElement('option')
    option.value = member
    option.appendChild(document.createTextNode(`${member}`))
    memberFilter.appendChild(option)
  })
}

// Populates the log after applying all filter selections
function populateLog (logEntries) {
  // Apply filters successively
  const filteredByAction = filterAction(logEntries)
  const filteredByMember = filterMember(filteredByAction)
  const filteredByDescription = filterDescription(filteredByMember)
  const sortedByTime = sortTime(filteredByDescription)

  // Loop variables
  let entriesHTML = ''
  let count = 0

  // Generate the list of accordion entries
  sortedByTime.forEach(entry => {
    entriesHTML += '<div class="accordion-item">'
    entriesHTML += '<h2 class="accordion-header">'
    entriesHTML += `<button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#entry${count}" aria-expanded="false" aria-controls="entry${count}">`
    entriesHTML += '<div class="container">'
    entriesHTML += '<div class="row">'
    entriesHTML += '<div class="col-md-3 text-center">'
    entriesHTML += `<span class="badge bg-secondary">${entry.action}</span>`
    entriesHTML += '</div>'
    entriesHTML += `<div class="col-md-3 text-center">${moment(entry.timestamp).format('HH:mm:ss')}</div>`
    entriesHTML += '<div class="col-md-3 text-center">'
    entriesHTML += `<p class="me-5 mb-0">${moment(entry.timestamp).format('ddd, DD MMM YYYY')}</p>`
    entriesHTML += '</div>'
    entriesHTML += `<div class="col-md-3 text-center">${entry.username}</div>`
    entriesHTML += '</div>'
    entriesHTML += '</div>'
    entriesHTML += '</button>'
    entriesHTML += '</h2>'
    entriesHTML += `<div id="entry${count}" class="accordion-collapse collapse" aria-labelledby="entry${count}" data-bs-parent="#log-entries">`
    entriesHTML += `<div class="accordion-body">${entry.description}</div>`
    entriesHTML += '</div>'
    entriesHTML += '</div>'

    count += 1
  })

  // Add them to the outer accordion container
  logAccordion.innerHTML = entriesHTML
}

/* ---------------------------- Filter Functions ---------------------------- */

// Filter by action
function filterAction (entries) {
  if (selectedAction === 'All Actions') {
    return entries
  }

  return entries.filter(entry => entry.action === selectedAction)
}

// Filter by member
function filterMember (entries) {
  if (selectedMember === 'All Members') {
    return entries
  }

  return entries.filter(entry => entry.username === selectedMember)
}

// Filter by description
function filterDescription (entries) {
  if (searchedDescription === '') {
    return entries
  }

  return entries.filter(entry => entry.description.toLowerCase().includes(searchedDescription))
}

// Sort by time in ascending or descending order
function sortTime (entries) {
  if (selectedTimeSort === 'Newest') {
    return entries.sort((a, b) => {
      if (moment(a.timestamp).isBefore(b.timestamp)) {
        return 1
      } else if (moment(a.timestamp).isAfter(b.timestamp)) {
        return -1
      } else {
        return 0
      }
    })
  } else if (selectedTimeSort === 'Oldest') {
    return entries.sort((a, b) => {
      if (moment(a.timestamp).isBefore(b.timestamp)) {
        return -1
      } else if (moment(a.timestamp).isAfter(b.timestamp)) {
        return 1
      } else {
        return 0
      }
    })
  } else {
    alert('Invalid sort selection')
  }
}
