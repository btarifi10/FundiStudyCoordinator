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

// Displays the existing chat history
function displayChat (prevMessages) {
  spinner.remove()
  prevMessages.forEach(message => {
    const username = message.username
    const text = message.text_sent
    const time = message.time_sent

    const chatMessage = formatChatMessage(username, text, time)
    displayMessage(chatMessage)
  })
}

// Adds a formatted chat message to the DOM
function displayMessage (message) {
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
