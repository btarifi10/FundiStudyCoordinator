'use strict'

const currentPolls = require('./polls').getCurrentPolls()

// Handling the socket io events
function handleVoting (io, socket) {
  // When a voter accesses the vote page
  socket.on('voterConnection', (group) => {
    socket.join(group)

    io.to(group).emit('updateCurrentPolls', getGroupActivePolls(group))
  })

  // On a new vote
  socket.on('vote', ({ userId, pollId, option }) => {
    // Increase the vote count at the index and record the user
    const pIndex = currentPolls.findIndex(p => p.pollId === pollId)

    if (pIndex >= 0) {
      if (currentPolls[pIndex].options[option]) {
        currentPolls[pIndex].options[option].votes += 1
        currentPolls[pIndex].voters.push(userId)
      }
    }

    // Show the poll in the console for testing

    // Tell everybody else about the new vote
    const groupPolls = getGroupActivePolls(currentPolls[pollId].group)
    io.to(currentPolls[pollId].group).emit('updateCurrentPolls', groupPolls)
  }
  )

  // On poll creation, update everyone
  socket.on('pollCreated', (group) => {
    const groupPolls = getGroupActivePolls(group)
    io.to(group).emit('updateCurrentPolls', groupPolls)
  })
}

// Filter polls by each group
function getGroupActivePolls (group) {
  const groupPolls = []
  currentPolls.forEach(poll => {
    if (poll.group === group) {
      groupPolls.push(poll)
    }
  })
  return groupPolls
}

// TODO: Update this to retrieve completed polls from the database
function getGroupPollHistory (groupId) {
  // Make Database call
  return null
}

// Exports
module.exports = {
  handleVoting
}
