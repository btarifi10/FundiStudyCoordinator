'use strict'

const express = require('express')
const path = require('path')
const db = require('./database-service')
const fetch = require('node-fetch')

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

meetingRouter.get('/getMeetings', function (req, res) {
  const group = req.query.group
  const option = req.query.option
  // Make a query to the database
  db.pools
  // Run query
    .then((pool) => {
      return pool.request()
        .input('group', db.sql.VarChar, group)
        .input('online', db.sql.Bit, option)
        .query(`SELECT groups.group_name, meetings.meeting_id, meetings.creator_id, meetings.meeting_time, meetings.place, meetings.link, meetings.is_online
        FROM meetings INNER JOIN groups
        ON meetings.group_id=groups.group_id
        WHERE (${option}) = meetings.is_online 
        AND (@group) = groups.group_name 
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
      console.log(result)
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

meetingRouter.get('/get-member-addresses', (req, res) => {
  db.pools
  // Run query
    .then((pool) => {
      return pool.request()
        .input('groupName', db.sql.Char, req.query.group)
        .query(`
        SELECT username, address_line_1, address_line_2, city, postal_code
        FROM users INNER JOIN memberships ON users.user_id=memberships.user_id WHERE
        memberships.group_id=(SELECT group_id FROM groups WHERE group_name=@groupName);
        `)
    })
  // Send back the result
    .then(result => {
      res.send(result.recordset)
    })
  // If there's an error, return that with some description
    .catch(err => {
      res.send({
        Error: err
      })
    })
})

meetingRouter.get('/get-distance-matrix', (req, res) => {
  const DIST_MATRIX_BASE_URL = 'https://maps.googleapis.com/maps/api/distancematrix/json'
  const API_KEY = 'AIzaSyCx_ZKS9QvVboI8DL_D9jDGA4sBHiAR3fU'

  fetch(`${DIST_MATRIX_BASE_URL}?origins=${req.query.origins}&destinations=${req.query.destinations}&key=${API_KEY}`)
    .then(res => res.json())
    .then(data => {
      res.send(data)
    })
})

module.exports = meetingRouter
