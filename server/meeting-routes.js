'use strict'

const express = require('express')
const { exists } = require('fs')
const path = require('path')
const db = require('./database-service')

const meetingRouter = express.Router()
meetingRouter.use(express.json())

meetingRouter.get('/meetings', function (req, res) {
  res.sendFile(path.join(__dirname, '..', 'views', 'meetings.html'))
})

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

meetingRouter.get('/onlineMeetings/:group', function (req, res) {
  const { group } = req.params
  // the "AND (@online) = meetings.is_online" part of the query currently does not
  // work as expected, therefore a 'work-around' has been implemented
  const online = 1
  // Make a query to the database
  db.pools
  // Run query
    .then((pool) => {
      return pool.request()
        .input('group', db.sql.VarChar, group)
        .input('online', db.sql.Bit, online)
        .query(`SELECT group_name, meeting_id, creator_id, meeting_time, place, link, is_online
        FROM meetings INNER JOIN groups
        ON meetings.group_id=groups.group_id
        WHERE EXISTS (
          SELECT *
          FROM meetings
          WHERE (@group) = groups.group_name 
          AND (@online) = meetings.is_online 
        )`)
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

meetingRouter.get('/faceMeetings', function (req, res) {
  const group_name = req.query.group_name
  const user_id = req.query.user_id
  const online = false
  // Make a query to the database
  db.pools
  // Run query
    .then((pool) => {
      return pool.request()
        .input('group_name', db.sql.VarChar, group_name)
        .input('user_id', db.sql.Int, user_id)
        .input('online', db.sql.Bit, online)
        .query(`SELECT passed 
        FROM screening 
        WHERE (@user_id) = screening.user_id
        AND 
        screening.passed = 1
        `)
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