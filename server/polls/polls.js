'use strict'

const db = require('../database-service')

// Keep a list of the current polls which are active
const currentPolls = []

/*
    Poll details:
    Title
    UserID
    Type
    Group (name)
    Time
    Length
    Options [{
        option
        votes
        color
    }]
    Outcome
    voters
*/

function createGroupRequestsPoll (details) {
  /*
    details = {userId, userName, group, duration }
  */

  const pollDetails = {
    title: `Accept group request from ${details.username}`,
    userId: details.userId,
    type: 'Request',
    group: details.group,
    time: details.duration,
    options: ['Yes', 'No'],
    outcome: '',
    voters: []
  }

  createPoll(pollDetails)
}

function createBanningPoll (details) {
  /*
    details = {userId, userName, group, duration }
  */
  const pollDetails = {
    title: `Ban ${details.username} from ${details.group}`,
    userId: details.userId,
    type: 'Ban',
    group: details.group,
    time: details.duration,
    options: ['Yes', 'No'],
    outcome: '',
    voters: []
  }

  createPoll(pollDetails)
}

function createInvitePoll (details) {
  /*
    details = {userId, userName, group, duration }
  */

  const pollDetails = {
    title: `Invite ${details.username} to group`,
    userId: details.userId,
    type: 'Invite',
    group: details.group,
    time: details.duration,
    options: ['Yes', 'No'],
    outcome: '',
    voters: []
  }

  createPoll(pollDetails)
}

function createPoll (pollDetails) {
  const options = []

  pollDetails.options.forEach(o => {
    options.push({ option: o, votes: 0, color: randomRGB() })
  })

  pollDetails.options = options

  pollDetails.pollId = currentPolls.length

  const pollID = pollDetails.pollId

  currentPolls.push(pollDetails)

  // socket.io message to update polls

  const msDuration = pollDetails.time * 60 * 60 * 1000
  setTimeout(() => {
    const poll = currentPolls[pollID]
    const outcome = poll.options.reduce((max, option) => max.votes > option.votes ? max : option)
    poll.outcome = outcome.option

    if (poll.type === 'Invite') {
      handleInviteOutcome(poll)
    } else if (poll.type === 'Request') {
      handleGroupRequestOutcome(poll)
      console.log(poll.title, 'completed')
    } else if (poll.type === 'Ban') {
      handleBanOutcome(poll)
    } else {
      console.log(poll.title, 'completed')
    }

    // Add poll to DB

    // socketIO update
  }, msDuration)
}

function randomRGB () {
  const r = () => Math.random() * 256 >> 0
  return `rgb(${r()}, ${r()}, ${r()})`
}

function getCurrentPolls () {
  return currentPolls
}

function handleGroupRequestOutcome (poll) {
  if (poll.outcome === 'Yes') {
    addUserToGroup(poll.userId, poll.group)
  }
}

function handleInviteOutcome (poll) {
  if (poll.outcome === 'Yes') {
    inviteUserToGroup(poll.userId, poll.group)
  }
}

function handleBanOutcome (poll) {
  if (poll.outcome === 'Yes') {
    removeUserFromGroup(poll.userId, poll.group)
  }
}

function addUserToGroup (userId, groupName) {
  db.pools
    // Run query
    .then((pool) => {
      return (
        pool
          .request()
          // Retrieve ALL invites for current user
          .input('group', db.sql.Char, groupName)
          .input('userId', db.sql.Int, userId)
          .input('time', db.sql.DateTimeOffset, new Date()).query(`
            INSERT INTO memberships (user_id, group_id, date_joined)
            VALUES (@userId, (SELECT group_id FROM groups WHERE group_name=@group), @time);
          `)
      )
    })
}

function inviteUserToGroup (userId, groupName) {
  db.pools
    // Run query
    .then((pool) => {
      return (
        pool
          .request()
          // Retrieve ALL invites for current user
          .input('group', db.sql.Char, groupName)
          .input('userId', db.sql.Int, userId)
          .input('time', db.sql.DateTimeOffset, new Date()).query(`
            INSERT INTO invites (receiver_id, group_id, time_sent)
            VALUES (@userId, (SELECT group_id FROM groups WHERE group_name=@group), @time);
          `)
      )
    })
}

function removeUserFromGroup (userId, groupName) {
  db.pools
    // Run query
    .then((pool) => {
      return (
        pool
          .request()
          // Retrieve ALL invites for current user
          .input('group', db.sql.Char, groupName)
          .input('userId', db.sql.Int, userId).query(`
            DELETE FROM memberships WHERE user_id = @userId AND
            group_id = (SELECT group_id FROM groups WHERE group_name=@group);
          `)
      )
    })
}

module.exports = {
  getCurrentPolls,
  currentPolls,
  createPoll,
  createGroupRequestsPoll,
  createBanningPoll,
  createInvitePoll
}
