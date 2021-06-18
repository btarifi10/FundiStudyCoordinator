'use strict'

const currentPollArea = document.getElementById('current-poll-area')

function formatPoll (poll) {
  const div = document.createElement('div')
  div.classList.add('poll')
  div.innerHTML =
    `<p class="meta"> ${message.username} <span> ${message.time} </span></p>
     <p class="text">${message.text}</p>`

  messageArea.appendChild(div)
}

function onVote (id, option) {

}
