'use strict'

const { logAction, formatAction } = require('../logging/logging.js')
const db = require('../database-service')
const moment = require('moment')

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

  let c = Math.random(10)
  pollDetails.options.forEach(o => {
    c = c + 1
    options.push({ option: o, votes: 0, color: selectColor(c) })
  })

  pollDetails.options = options

  let pollID = 0
  if (currentPolls.length > 0) { pollID = currentPolls.reduce((max, p) => max > p.pollId ? max : p.pollId) + 1 }

  pollDetails.pollId = pollID

  currentPolls.push(pollDetails)

  let msDuration = pollDetails.duration * 60 * 60 * 1000

  if (process.env.DEPLOYMENT === 'TEST') {
    msDuration = 15 * 1000
  }
  // Record the start of the poll
  const actionObj = formatAction({
    action: 'POLL',
    groupName: pollDetails.group,
    timestamp: pollDetails.date,
    description: `${pollDetails.type} poll has started - "${pollDetails.title}", Available for ${pollDetails.duration.toFixed(2)} hours `
  })
  logAction(actionObj, pollDetails.userId) // this is the id of the user who is being voted on

  // Set the function which will be called after poll expiration
  setTimeout(() => {
    const pIndex = currentPolls.findIndex(p => p.pollId === pollID)
    const poll = currentPolls[pIndex]
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
      description: `${pollDetails.type} poll - "${pollDetails.title}" - has ended with outcome: ${pollDetails.outcome} `
    })
    logAction(actionObj, pollDetails.userId) // this is the id of the user who is being voted on

    // Log an invite if the invite poll outcome is 'yes'
    if ((pollDetails.type === 'Invite') && (pollDetails.outcome === 'Yes')) {
      const inviteObj = formatAction({
        action: 'INVITE',
        groupName: pollDetails.group,
        timestamp: moment().format(),
        description: `Poll - "${pollDetails.title}" - is a success `
      })
      logAction(inviteObj, pollDetails.userId)
    }

    // Add poll to DB
    currentPolls.splice(pIndex, 1)

    // Add poll to DB
    addPollToDb(poll)
    // socketIO update
  }, msDuration)
}

function randomRGB () {
  const r = () => Math.random() * 256 >> 0
  return `rgb(${r()}, ${r()}, ${r()})`
}

function selectColor (number) {
  const hue = number * 137.508 // use golden angle approximation
  return `hsl(${hue},50%,75%)`
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

// Post poll to Database
function addPollToDb (poll) {
  db.pools
    // Run query
    .then((pool) => {
      return (
        pool
          .request()
          .input('title', db.sql.Char, poll.title)
          .input('group', db.sql.Char, poll.group)
          .input('poll_type', db.sql.Char, poll.type)
          .input('userId', db.sql.Int, poll.userId)
          .input('start_date', db.sql.DateTimeOffset, poll.date)
          .input('duration', db.sql.Float, poll.duration)
          .input('outcome', db.sql.Char, poll.outcome)
          .query(`
            INSERT INTO polls (title, group_name, poll_type, user_id, start_date, duration, outcome)
            VALUES (@title, @group, @poll_type, @userId, @start_date, @duration, @outcome);

            SELECT SCOPE_IDENTITY();
          `)
      )
    }).then(result => {
      const pollId = result.recordset[0]['']
      db.pools
      // Run query
        .then((pool) => {
          return (
            poll.options.forEach(opt => {
              pool
                .request()
                .input('pollId', db.sql.Int, pollId)
                .input('candidate', db.sql.VarChar, opt.option)
                .input('votes', db.sql.Int, opt.votes)
                .query(`
            INSERT INTO poll_stats (poll_id, candidate, votes)
            VALUES (@pollId, @candidate, @votes);
          `)
            })
          )
        })
    })
}

function getGroupHistory (group) {
  async function getDetails () {
    const allPolls = await getCompletedPolls(group)
    const allVotes = await getCompletedPollsVotes(group)
    return { allPolls, allVotes }
  }

  return getDetails().then(({ allPolls, allVotes }) => {
    if (allPolls.length === 0) { return null }

    const groupPolls = []
    allPolls.forEach(p => {
      const poll = {
        title: p.title,
        userId: p.user_id,
        type: p.poll_type,
        group: p.group_name,
        date: p.start_date,
        duration: p.duration,
        options: [],
        outcome: p.outcome
      }

      let c = Math.random(10)
      allVotes.forEach(v => {
        if (v.poll_id === p.poll_id) {
          c = c + 1
          poll.options.push({
            option: v.candidate,
            votes: v.votes,
            color: selectColor(c)
          })
        }
      })

      groupPolls.push(poll)
    })
    return groupPolls
  })
}

function getCompletedPolls (group) {
  return db.pools
    // Run query
    .then((pool) => {
      return (
        pool
          .request()
          .input('group', db.sql.Char, group)
          .query(`
            SELECT * FROM polls WHERE group_name=@group
          `)
      )
    }).then(result => result.recordset)
}

function getCompletedPollsVotes (group) {
  return db.pools
  // Run query
    .then((pool) => {
      return (
        pool
          .request()
          .input('group', db.sql.Char, group)
          .query(`
        SELECT * FROM poll_stats WHERE poll_id IN 
        (SELECT poll_id FROM polls where group_name=@group);
      `)
      )
    }).then(result => result.recordset)
}

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
          .input('time', db.sql.DateTimeOffset, new Date())
          .query(`
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

function clearPolls () {
  if (process.env.DEPLOYMENT === 'TEST') {
    currentPolls.splice(0, currentPolls.length)
  }
}

module.exports = {
  getCurrentPolls,
  currentPolls,
  clearPolls,
  createCustomPoll,
  createGroupRequestsPoll,
  createBanningPoll,
  createInvitePoll,
  getGroupHistory
}
