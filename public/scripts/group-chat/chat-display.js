/* ------------------------------ Description ----------------------------------
This file contains the functions concerned with displaying the elements of the
group chat within the client's browser.
*/

/* ------------------------------ DOM Elements ------------------------------ */

const messageArea = document.querySelector('.message-area')
const groupName = document.getElementById('group-name')
const chatMembers = document.getElementById('chat-members')
const spinner = document.getElementById('spinner')

/* ----------------------------- Main Functions ----------------------------- */

// Define an initial start date for grouping the messages by date
let prevDate = '1970-01-01'

// Displays the existing chat history
function displayChat (prevMessages) {
  spinner.remove()
  prevMessages.forEach(message => {
    const username = message.username
    const text = message.text_sent
    const time = message.time_sent
    const nextDate = moment(time).format('YYYY-MM-DD')

    const chatMessage = formatChatMessage(username, text, time)
    displayMessage(chatMessage, nextDate)
  })
}

// Adds a formatted chat message to the DOM
function displayMessage (message, nextDate) {
  // Add a date divider if it is a new day
  if (moment(nextDate).isAfter(prevDate, 'day')) {
    addDateDivider(nextDate)
    prevDate = nextDate
  }

  // Convert links to anchor elements
  const messageWithLinks = embedLinks(message.text)

  const div = document.createElement('div')
  div.classList.add('message')
  div.innerHTML =
    `<p class="meta"> ${message.username} <span> ${message.time} </span></p>
     <p class="text">${messageWithLinks}</p>`

  messageArea.appendChild(div)

  // Automatically scroll down to the newly added message
  messageArea.scrollTop = messageArea.scrollHeight
}

// Adds the group name to the DOM
function displayGroupName (group) {
  groupName.innerText = group
}

// Adds the chat members list to the DOM
function displayChatMembers (members) {
  chatMembers.innerHTML = `
    ${members.map(member => `<li>${member.username}</li>`).join('')}
  `
}

/* ---------------------------- Helper Functions ---------------------------- */

function addDateDivider (date) {
  const formattedDate = formatDate(date)

  // Column 1: Left horizontal line
  const col1 = document.createElement('div')
  col1.classList.add('col-md-4')
  col1.appendChild(document.createElement('hr'))

  // Column 2: Date
  const dateP = document.createElement('p')
  dateP.classList.add('date')
  dateP.appendChild(document.createTextNode(formattedDate))

  const col2 = document.createElement('div')
  col2.classList.add('col-md-4')
  col2.appendChild(dateP)

  // Column 3: Right horizontal line
  const col3 = document.createElement('div')
  col3.classList.add('col-md-4')
  col3.appendChild(document.createElement('hr'))

  // Row container for the 3 columns
  const row = document.createElement('div')
  row.classList.add('row')
  row.classList.add('text-center')
  row.appendChild(col1)
  row.appendChild(col2)
  row.appendChild(col3)

  // Add this row to the message area
  messageArea.appendChild(row)
}

// Formats the date displayed relative to today's date
function formatDate (date) {
  const currentDate = moment().format('YYYY-MM-DD')

  // Date is today's date
  if (moment(date).isSame(currentDate, 'day')) {
    return 'Today'
  }

  // Date is yesterday's date
  if (moment(date).isSame(moment(currentDate).subtract(1, 'days'), 'day')) {
    return 'Yesterday'
  }

  // Date is within the last week
  if (moment(date).isAfter(moment(currentDate).subtract(7, 'days'), 'day')) {
    return moment(date).format('dddd')
  }

  // Date is over a week ago
  return moment(date).format('ddd, DD MMM YYYY')
}

// Links are truncated from the middle to 40 characters and open in a new window
function embedLinks (text) {
  return anchorme({
    input: text,

    options: {
      truncate: 40,
      middleTruncation: true,

      attributes: function (string) {
        const attributes = {
          target: '_blank'
        }

        if (string.endsWith('zip')) {
          attributes.download = true
        }
        return attributes
      }
    }
  })
}
