const { checkAuthenticated } = require('./authentication.js')
'use strict'

/* ------------------------------ Requirements ------------------------------ */
const express = require('express')
const path = require('path')
const db = require('./database-service')
const fetch = require('node-fetch')

/* ----------------------------- Initial Setup ----------------------------- */
const meetingRouter = express.Router()
meetingRouter.use(express.json())

/* ----------------------------- Routes ----------------------------- */

meetingRouter.get('/meetings', checkAuthenticated, function (req, res) {
  res.sendFile(path.join(__dirname, '..', 'views', 'meetings.html'))
})

meetingRouter.get('/attend-meeting', checkAuthenticated, function (req, res) {
  res.sendFile(path.join(__dirname, '..', 'views', 'attend-meeting.html'))
})

/* ----------------------------- Database calls ----------------------------- */

meetingRouter.get('/getMeetings', checkAuthenticated, function (req, res) {
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
        AND meetings.meeting_time > DATEADD(day,-1,GETDATE())
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

meetingRouter.get('/faceMeetings', checkAuthenticated, function (req, res) {
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
        .query(`SELECT passed, date_screened 
        FROM screening 
        WHERE (@user_id) = screening.user_id
        AND date_screened > DATEADD(hour, -72, GETDATE())
        ORDER BY date_screened DESC
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

meetingRouter.post('/record-meeting', checkAuthenticated, function (req, res) {
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
      // console.log(result)
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

meetingRouter.get('/get-address', (req, res) => {
  db.pools
  // Run query
    .then((pool) => {
      return pool.request()
        .input('user_id', db.sql.Char, req.query.user_id)
        .query(`
        SELECT address_line_1, address_line_2, city, postal_code
        FROM users
        WHERE @user_id = users.user_id;
        `)
    })
  // Send back the result
    .then(result => {
      res.send(result.recordset)
      console.log(result.recordset)
    })
  // If there's an error, return that with some description
    .catch(err => {
      res.send({
        Error: err
      })
    })
})

meetingRouter.get('/get-coords', (req, res) => {
  const GEOCODE_URL = 'https://maps.googleapis.com/maps/api/geocode/json?'
  const API_KEY = 'AIzaSyCx_ZKS9QvVboI8DL_D9jDGA4sBHiAR3fU'
  const URL = `${GEOCODE_URL}address=${req.query.location}&key=${API_KEY}`
  const encoded_URL = encodeURI(URL)
  console.log(encoded_URL)
  fetch(encoded_URL)
    .then(res => res.json())
    .then(data => {
      res.send(data)
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

meetingRouter.get('/meetingLink', checkAuthenticated, function (req, res) {
  const meeting_id = req.query.meeting_id
  // Make a query to the database
  db.pools
  // Run query
    .then((pool) => {
      return pool.request()
        .input('meeting_id', db.sql.Int, meeting_id)
        .query(`SELECT link 
        FROM meetings
        WHERE (@meeting_id) = meetings.meeting_id
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

module.exports = meetingRouter
