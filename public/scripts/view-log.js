'use strict'

/* ------------------------------ DOM Elements ------------------------------ */

const actionFilter = document.getElementById('action-filter')
const memberFilter = document.getElementById('member-filter')
const descriptionSearch = document.getElementById('description-search')
const timestampFilter = document.getElementById('timestamp-filter')
const logAccordion = document.getElementById('log-entries')
const displayTable = document.getElementById('log-table')

/* --------------------------------- Setup --------------------------------- */

let logEntries = []

// Filter selections
let selectedAction = 'All Actions'
let selectedMember = 'All Members'
let searchedDescription = ''
let selectedTimeSort = 'Newest'

// Retrieve the group name from the URL
const { group } = Qs.parse(location.search, {
  ignoreQueryPrefix: true
})

// On page load event, retrieve the relevant database entries
document.addEventListener('DOMContentLoaded', function () {
  // Populate action filter with possible actions
  fetch('/get-actions')
    .then(response => response.json())
    .then(actions => {
      populateActionFilter(actions.recordset)
    })

  // Populate member filter with group members
  fetch(`/get-members?group=${group}`)
    .then(response => response.json())
    .then(members => {
      populateMemberFilter(members.recordset)
    })

  // Fetch all the log entries corresponding to this group
  fetch(`/get-log?group=${group}`)
    .then(response => response.json())
    .then(log => {
      logEntries = log.recordset
      populateLog(logEntries)
    })

  document.getElementById('back-button').href = `/chat?group=${group}`
})

/* ----------------------------- Filter Events ----------------------------- */

// All filter selections are applied each time a single filter option is changed

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
    option.value = action.action.trim()
    option.appendChild(document.createTextNode(`${action.action.trim()}`))
    actionFilter.appendChild(option)
  })
}

// Used to populate the member filter with all the members in the group
function populateMemberFilter (members) {
  members.forEach(member => {
    const option = document.createElement('option')
    option.value = member.username.trim()
    option.appendChild(document.createTextNode(`${member.username.trim()}`))
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

  // Check if no results found for current filter selection
  if (sortedByTime.length === 0) {
    displayTable.innerHTML = "<tr><td class='text-center' colspan='4'>No Matching Entries</td></tr>"
  } else {
    displayTable.innerHTML = ''
  }

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
    entriesHTML += `<span class="badge bg-secondary me-3">${entry.action}</span>`
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
  return entries.filter(entry => entry.action.trim() === selectedAction)
}

// Filter by member
function filterMember (entries) {
  if (selectedMember === 'All Members') {
    return entries
  }

  return entries.filter(entry => entry.username.trim() === selectedMember)
}

// Filter by description
function filterDescription (entries) {
  if (searchedDescription === '') {
    return entries
  }

  return entries.filter(entry => entry.description.trim().toLowerCase().includes(searchedDescription))
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
