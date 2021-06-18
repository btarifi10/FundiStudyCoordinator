'use strict'

const { createPoll } = require('./polls')

const currentPolls = require('./polls').getCurrentPolls()

function handleVoting (io, socket) {
  if (currentPolls.length === 0) {
    createPoll({
      title: 'This is a test poll',
      type: 'Custom',
      group: 'Software Development III',
      start: new Date(),
      time: 1,
      options: ['option1', 'option2', 'option3'],
      voters: [],
      outcome: null
    })

    currentPolls[0].options[0].votes = 5
    currentPolls[0].options[1].votes = 4
    currentPolls[0].options[2].votes = 6

    createPoll({
      title: 'This is another test poll',
      type: 'Custom',
      group: 'Software Development III',
      start: new Date(),
      time: 1,
      options: ['option1', 'option2', 'option3'],
      voters: [14],
      outcome: null
    })

    currentPolls[1].options[0].votes = 2
    currentPolls[1].options[1].votes = 4
    currentPolls[1].options[2].votes = 7

    createPoll({
      title: 'This is a sociology test poll',
      type: 'Custom',
      group: 'Sociology',
      start: new Date(),
      time: 1,
      options: ['option1', 'option2', 'option3'],
      voters: [],
      outcome: null
    })
  }

  socket.on('voterConnection', (group) => {
    socket.join(group)

    console.log('connection in group ', group)
    const g = getGroupActivePolls(group)
    console.log('Group polls for ', group)
    console.log(g)
    io.to(group).emit('updateCurrentPolls', g)
  })

  // On new vote
  socket.on('vote', ({ userId, pollId, option }) => {
    // Increase the vote at index
    if (currentPolls[pollId].options[option]) {
      currentPolls[pollId].options[option].votes += 1
      currentPolls[pollId].voters.push(userId)
    }

    // Show the candidate in the console for testing
    console.log('Poll:')
    console.log(currentPolls[pollId])

    // Tell everybody else about the new vote
    const g = getGroupActivePolls(currentPolls[pollId].group)
    console.log('Group polls')
    console.log(g)
    io.to(currentPolls[pollId].group).emit('updateCurrentPolls', g)
  })

  socket.on('pollCreated', (group) => {
    const g = getGroupActivePolls(group)

    io.to(group).emit('updateCurrentPolls', g)
  })
}
/*
function getGroupActivePollsForUser (groupPolls, userId) {
  const pollList = []

  groupPolls.forEach(poll => {
    if (poll.voters.includes(userId)) {
      const p = {
        title: poll.title,
        type: poll.type,
        group: poll.group,
        start: poll.start,
        length: poll.length,
        options: poll.options,
        userVoted: true
      }

      pollList.push(p)
    }
  })

  return pollList
}
*/

function getGroupActivePolls (group) {
  const gPolls = []
  console.log(group)
  currentPolls.forEach(poll => {
    console.log(poll.group)
    if (poll.group === group) {
      gPolls.push(poll)
    }
  })
  return gPolls
}

function getGroupPollHistory (groupId) {
  // Make Database call
  return null
}

// socket io: voting
/*
    function(pollID, option)
    {
        increase vote count for option
    }

*/

function createNewPoll () {
  createPoll()
}

module.exports = {
  handleVoting
}
