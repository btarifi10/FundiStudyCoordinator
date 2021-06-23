'use strict'

const { logAction, formatAction } = require('../logging/logging.js')
const db = require('../database-service')

// Keep a list of the current polls which are active
const currentPolls = []

// Return the up to date currentPolls
function getCurrentPolls () {
  // Just for testing: creates a few custom polls
  // if (currentPolls.length === 0) {
  //   createPoll({
  //     title: 'This is a test poll',
  //     type: 'Custom',
  //     group: 'Software Development III',
  //     date: new Date(),
  //     duration: 1,
  //     options: ['option1', 'option2', 'option3'],
  //     voters: [],
  //     outcome: null
  //   })

  //   currentPolls[0].options[0].votes = 5
  //   currentPolls[0].options[1].votes = 4
  //   currentPolls[0].options[2].votes = 6

  //   createPoll({
  //     title: 'This is another test poll',
  //     type: 'Custom',
  //     group: 'Software Development III',
  //     date: new Date(),
  //     duration: 1,
  //     options: ['option1', 'option2', 'option3'],
  //     voters: [14],
  //     outcome: null
  //   })

  //   currentPolls[1].options[0].votes = 2
  //   currentPolls[1].options[1].votes = 4
  //   currentPolls[1].options[2].votes = 7

  //   createPoll({
  //     title: 'This is a sociology test poll',
  //     type: 'Custom',
  //     group: 'Sociology',
  //     date: new Date(),
  //     duration: 1,
  //     options: ['option1', 'option2', 'option3'],
  //     voters: [],
  //     outcome: null
  //   })
  // }

  return currentPolls
}

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

/* ------------------------------ Poll Creation --------------------------------- */

/* ------------ Format the poll details to be used by one creation function ------------ */
function createGroupRequestsPoll (details) {
  /*
    details = {userId, userName, group, date, duration }
  */

  const pollDetails = {
    title: `Accept group request from ${details.username.trim()}`,
    userId: details.userId,
    type: 'Request',
    group: details.group,
    date: details.date,
    duration: details.duration,
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
    title: `Ban ${details.username.trim()} from ${details.group}`,
    userId: details.userId,
    type: 'Ban',
    group: details.group,
    date: details.date,
    duration: details.duration,
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
    title: `Invite ${details.username.trim()} to group`,
    userId: details.userId,
    type: 'Invite',
    group: details.group,
    date: details.date,
    duration: details.duration,
    options: ['Yes', 'No'],
    outcome: '',
    voters: []
  }

  createPoll(pollDetails)
}

function createCustomPoll (details, userId) {
  const pollDetails = {
    title: details.title,
    userId: userId,
    type: 'Custom',
    group: details.group,
    date: details.date,
    duration: details.duration,
    options: details.options,
    outcome: '',
    voters: []
  }

  createPoll(pollDetails)
}

/* ------------------------- Create Poll ----------------------------- */
function createPoll (pollDetails) {
  const options = []

  pollDetails.options.forEach(o => {
    options.push({ option: o, votes: 0, color: randomRGB() })
  })

  pollDetails.options = options

  pollDetails.pollId = currentPolls.length

  const pollID = pollDetails.pollId

  currentPolls.push(pollDetails)

  const msDuration = pollDetails.duration * 60 * 60 * 1000

  // Record the start of the poll
  const actionObj = formatAction({
    action: 'POLL',
    groupName: pollDetails.group,
    timestamp: pollDetails.date,
    description: `${pollDetails.type} poll has started - "${pollDetails.title}" for ${pollDetails.duration} hours `
  })
  logAction(actionObj, pollDetails.userId) // this is the id of the user who is being voted on

  // Set the function which will be called after poll expiration
  setTimeout(() => {
    const poll = currentPolls[pollID]
    // Get the outcome
    const outcome = poll.options.reduce((max, option) => max.votes > option.votes ? max : option)
    poll.outcome = outcome.option

    if (poll.type === 'Invite') {
      handleInviteOutcome(poll)
    } else if (poll.type === 'Request') {
      handleGroupRequestOutcome(poll)
      // console.log(poll.title, 'completed')
    } else if (poll.type === 'Ban') {
      handleBanOutcome(poll)
    } else {
      // console.log(poll.title, 'completed')
    }

    // Record end of the poll
    const actionObj = formatAction({
      action: 'POLL',
      groupName: pollDetails.group,
      timestamp: pollDetails.date,
      description: `${pollDetails.type} poll has ended - "${pollDetails.title} - with outcome: ${pollDetails.outcome}" `
    })
    logAction(actionObj, pollDetails.userId) // this is the id of the user who is being voted on

    // Add poll to DB

    // socketIO update
  }, msDuration)
}

function randomRGB () {
  const r = () => Math.random() * 256 >> 0
  return `rgb(${r()}, ${r()}, ${r()})`
}

/* --------------------- Handling Poll outcomes ----------------------- */

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

/* ------------------------ Updating the database -------------------- */

// Upon group request approval
function addUserToGroup (userId, groupName) {
  db.pools
    // Run query
    .then((pool) => {
      return (
        pool
          .request()
          .input('group', db.sql.Char, groupName)
          .input('userId', db.sql.Int, userId)
          .input('time', db.sql.DateTimeOffset, new Date()).query(`
            INSERT INTO memberships (user_id, group_id, date_joined)
            VALUES (@userId, (SELECT group_id FROM groups WHERE group_name=@group), @time);
          `)
      )
    })
}

// Upon invite approval
function inviteUserToGroup (userId, groupName) {
  db.pools
    // Run query
    .then((pool) => {
      return (
        pool
          .request()
          .input('group', db.sql.Char, groupName)
          .input('userId', db.sql.Int, userId)
          .input('time', db.sql.DateTimeOffset, new Date()).query(`
            INSERT INTO invites (receiver_id, group_id, time_sent)
            VALUES (@userId, (SELECT group_id FROM groups WHERE group_name=@group), @time);
          `)
      )
    })
}

// Upon banning approval
function removeUserFromGroup (userId, groupName) {
  db.pools
    .then((pool) => {
      return (
        pool
          .request()
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
  createCustomPoll,
  createGroupRequestsPoll,
  createBanningPoll,
  createInvitePoll
}
