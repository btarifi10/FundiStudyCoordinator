'use strict'

const express = require('express')
// const path = require('path')
const db = require('./database-service')

const meetingRouter = express.Router()
meetingRouter.use(express.json())

meetingRouter.get('/meetingViews/:group', function (req, res) {
  const { group } = req.params
  // Make a query to the database
  db.pools
  // Run query
    .then((pool) => {
      return pool.request()
        .input('group', db.sql.VarChar, group)
        .query('SELECT meeting_id, group_name, creator_id, meeting_time, place, link, is_online FROM groups INNER JOIN meetings ON meetings.group_id=groups.group_id WHERE (@group) = groups.group_name')
    })
  // Send back the result
    .then(result => {
      res.send(result)
    })
  // If there's an error, return that with some description
    .catch(err => {
      res.send({
        Error: err
      })
    })
})

meetingRouter.post('/record-meeting', function (req, res) {
  // Retrieve the message data
  const meeting = req.body
  console.log(meeting)
  // Make a query to the database
  db.pools
  // Run query
    .then((pool) => {
      return pool.request()
        .input('group_name', db.sql.Char, meeting.group_name)
        .input('creator_id', db.sql.Int, meeting.creator_id)
        .input('meeting_time', db.sql.DateTimeOffset, meeting.meeting_time)
        .input('place', db.sql.VarChar, meeting.place)
        .input('link', db.sql.VarChar, meeting.link)
        .input('is_online', db.sql.Bit, meeting.is_online)
        .query(`INSERT INTO meetings (group_id, creator_id, meeting_time, place, link, is_online)  
                  SELECT group_id,(@creator_id),(@meeting_time), (@place), (@link),(@is_online)
                  FROM groups
                  WHERE groups.group_name = (@group_name);
                  `)
    })
  // Send back the result
    .then(result => {
      console.log(result)
      res.send(result)
    })
  // If there's an error, return that with some description
    .catch(err => {
      res.send({
        Error: err
      })
    })
})

module.exports = meetingRouter
