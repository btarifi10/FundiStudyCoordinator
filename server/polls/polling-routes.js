'use strict'
const express = require('express')
const path = require('path')
const db = require('../database-service')
const {
  createBanningPoll,
  createGroupRequestsPoll,
  createInvitePoll,
  createCustomPoll,
  getGroupHistory
} = require('./polls.js')

const { checkAuthenticated } = require('../authentication')

const pollingRouter = express.Router()

/* ------------------------------ Page Routes ------------------------------ */

pollingRouter.get('/polls', function (req, res) {
  res.sendFile(path.join(__dirname, '..', '..', 'views', 'polling.html'))
})

/* ----------------------------- Database calls ----------------------------- */

pollingRouter.get('/api/get-group-requests', checkAuthenticated, (req, res) => {
  const group = req.query.group
  db.pools
    // Run query
    .then((pool) => {
      return (
        pool
          .request()
          .input('group', db.sql.Char, group).query(`
          SELECT group_requests.requests_id, users.user_id, users.username, 
          group_requests.time_sent
          FROM users INNER JOIN
          group_requests ON group_requests.user_id=users.user_id WHERE 
          group_requests.group_id IN (
              SELECT group_id FROM groups
              WHERE group_name=@group
          );
            `)
      )
    })
    // Send back the result
    .then((result) => {
      if (result.recordset) {
        res.send(result.recordset)
      } else {
        res.send(null)
      }
    })
})

pollingRouter.get('/api/get-group-members', (req, res) => {
  const group = req.query.group

  db.pools
    // Run query
    .then((pool) => {
      return (
        pool
          .request()
          .input('group', db.sql.Char, group).query(`
          SELECT users.user_id, users.username
          FROM users INNER JOIN
          memberships ON memberships.user_id=users.user_id
          WHERE memberships.group_id IN (
          SELECT group_id
          FROM groups
          WHERE group_name=@group);
            `)
      )
    })
    // Send back the result
    .then((result) => {
      if (result.recordset) {
        res.send(result.recordset)
      } else {
        res.send(null)
      }
    })
})

pollingRouter.get('/api/get-users-to-invite', (req, res) => {
  const group = req.query.group

  db.pools
    // Run query
    .then((pool) => {
      return (
        pool
          .request()
          .input('group', db.sql.Char, group).query(`
          SELECT users.user_id, users.username
          FROM users WHERE user_id NOT IN 
          (SELECT user_id FROM memberships WHERE
            group_id = (SELECT group_id
              FROM groups
              WHERE group_name=@group)) AND user_id NOT IN
          (SELECT receiver_id FROM invites WHERE
            group_id= (SELECT group_id
              FROM groups
              WHERE group_name=@group) );
            `)
      )
    })
    // Send back the result
    .then((result) => {
      if (result.recordset) {
        res.send(result.recordset)
      } else {
        res.send(null)
      }
    })
})

pollingRouter.get('/api/get-poll-history', (req, res) => {
  const group = req.query.group
  getGroupHistory(group)
    .then(polls => {
      res.send(polls)
    })
})

/* --------------------- API calls to start Polls ----------------------- */

// API call to start group request poll
pollingRouter.post('/api/start-requests-poll', (req, res) => {
  const details = req.body

  /*
    details = { requestId, userId, userName, group, duration }
  */
  deleteGroupRequest(details.requestId)

  createGroupRequestsPoll(details)

  res.sendStatus(200)
})

// API call to start group request poll
pollingRouter.post('/api/start-invites-poll', (req, res) => {
  const details = req.body
  /*
    details = { userId, username, group, duration }
  */

  createInvitePoll(details)
  res.sendStatus(200)
})

pollingRouter.post('/api/start-custom-poll', (req, res) => {
  const details = req.body
  /*
    details = {
    title,
    group: details.group,
    time: details.duration,
    options: ['Yes', 'No'],
    outcome: '',
    voters: []
  }
  */

  createCustomPoll(details)

  res.send(200)
})

// API call to start banning poll
pollingRouter.post('/api/start-banning-poll', (req, res) => {
  const details = req.body

  createBanningPoll(details)

  res.send(200)
})

function deleteGroupRequest (reqId) {
  db.pools
    // Run query
    .then((pool) => {
      return (
        pool
          .request()
          // Retrieve ALL invites for current user
          .input('reqId', db.sql.Int, reqId).query(`
            DELETE FROM group_requests WHERE requests_id=@reqId;
            `)
      )
    })
}

module.exports = {
  pollingRouter
}
