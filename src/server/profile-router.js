'use strict'

const express = require('express')
const profileRouter = express.Router()
const path = require('path')
const db = require('./database-service')
const moment = require('moment')

const { checkAuthenticated } = require('./authentication')

profileRouter.get('/invites', checkAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, '..', '..', 'views', 'invites.html'))
})

profileRouter.get('/profile', checkAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, '..', '..', 'views', 'profile.html'))
})

profileRouter.get('/api/getInvites', checkAuthenticated, (req, res) => {
  db.pools
    // Run query
    .then((pool) => {
      return pool.request()
        // Retrieve ALL invites for current user
        .input('user', db.sql.Char, req.user.userId)
        .query(`
                SELECT invites.invite_id, groups.group_id, groups.group_name, groups.course_code, invites.time_sent
                FROM invites
                INNER JOIN groups ON invites.group_id=groups.group_id
                WHERE invites.receiver_id=@user;
            `)
    })
    // Send back the result
    .then(result => {
      if (result.recordset) {
        res.send(result.recordset)
      } else {
        res.send(null)
      }
      // res.send(result)
    })
})

profileRouter.post('/api/acceptInvite', checkAuthenticated, (req, res) => {
  const inviteId = req.query.inviteId
  const groupId = req.query.groupId

  db.pools
    // Run query to delete invite and join group
    .then((pool) => {
      return pool.request()
        .input('invite', db.sql.Char, inviteId)
        .input('group', db.sql.Char, groupId)
        .input('user', db.sql.Char, req.user.userId)
        .input('date', db.sql.DateTimeOffset, moment().format())
        .query(`
                DELETE FROM invites WHERE invites.invite_id=@invite;
                INSERT INTO memberships (user_id, group_id, date_joined)
                VALUES (@user, @group, @date)
            `)
    })
    // Send back the result
    .then(result => {
      res.sendStatus(200)
    }).catch(err => {
      res.send({ Error: err })
    })
})

profileRouter.post('/api/declineInvite', checkAuthenticated, (req, res) => {
  const inviteId = req.query.inviteId

  db.pools
  // Run query to delete invite
    .then((pool) => {
      return pool.request()
      // This is only a test query, change it to whatever you need
        .input('invite', db.sql.Char, inviteId)
        .query(`
                  DELETE FROM invites WHERE invites.invite_id=@invite;
              `)
    })
  // Send back the result
    .then(result => {
      res.sendStatus(200)
    }).catch(err => {
      res.send({ Error: err })
    })
})

module.exports = profileRouter
