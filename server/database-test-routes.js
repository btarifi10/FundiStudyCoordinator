'use strict'

const express = require('express')
const path = require('path')
const db = require('./database-service')

const testRouter = express.Router()
testRouter.use(express.json())

/* ---------------------------- Chat Test Routes ---------------------------- */

// Clear all the entries in the message table
testRouter.get('/clear-messages', function (req, res) {
  // Make a query to the database
  db.pools
    // Run query
    .then((pool) => {
      return pool.request()
        .query('DELETE FROM messages')
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

/* -------------------------------------------------------------------------- */

testRouter.get('/clear-groups', function (req, res) {
  console.log('HELLOO THERE, I am clearing the database from any NewGroup1')
  // Make a query to the database
  db.pools
    // Run query
    .then((pool) => {
      return pool.request()
        .query(`
        DELETE FROM invites WHERE group_id IN (SELECT group_id FROM groups WHERE group_name ='NewGroup1')
        DELETE FROM memberships WHERE group_id IN (SELECT group_id FROM groups WHERE group_name ='NewGroup1')
        DELETE FROM action_log WHERE group_id IN (SELECT group_id FROM groups WHERE group_name ='NewGroup1')
        DELETE FROM groups WHERE (group_name ='NewGroup1')
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

testRouter.get('/clear-requests', function (req, res) {
  // Make a query to the database
  db.pools
    // Run query
    .then((pool) => {
      return pool.request()
        .query("DELETE FROM group_requests WHERE group_id IN (SELECT group_id FROM groups WHERE group_name ='NewGroup1')")
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

testRouter.post('/createGroup', function (req, res) { // KEEP THIS
  const { groupName, courseCode, dateCreated } = req.body
  console.log('The group being created by server call to database:')
  console.log(req.body)
  db.pools
    // Run query
    .then((pool) => {
      return pool.request()
        .input('group_name', db.sql.Char, groupName)
        .input('course_code', db.sql.Char, courseCode)
        .input('date_created', db.sql.DateTimeOffset, dateCreated)
        .query(`
          INSERT INTO groups (group_name, course_code, date_created)
          VALUES ((@group_name),(@course_code),(@date_created));
        `)
    })
    .then(result => {
      res.send(result)
    })
    .catch(err => {
      res.send({
        Error: err
      })
    })
})

testRouter.post('/complete-group-creation', function (req, res) { // KEEP THIS
  const { groupName, invitedMembers, dateCreated } = req.body
  console.log('the member info:')
  console.log(req.body)
  db.pools
    // Run query
    .then((pool) => {
      invitedMembers.forEach(member => {
        console.log('The member being added:')
        console.log(member)
        pool.request()
          .input('userId', db.sql.Int, member.user_id)
          .input('groupName', db.sql.Char, groupName)
          .input('dateCreated', db.sql.DateTimeOffset, dateCreated)
          .query(`
            INSERT INTO invites (receiver_id, group_id, time_sent)
            VALUES (@userId, (SELECT group_id FROM groups WHERE group_name = @groupName), @dateCreated);
          `)
      })
      return pool.request()
        .input('userId', db.sql.Int, req.user.userId)
        .input('groupName', db.sql.Char, groupName)
        .input('dateCreated', db.sql.DateTimeOffset, dateCreated)
        .query(`
            INSERT INTO memberships (user_id, group_id, date_joined)
            VALUES (@userId, (SELECT group_id FROM groups WHERE group_name = @groupName), @dateCreated);
          `)
    })
    // Send back the result
    .then(result => {
      //res.redirect('/dashboard')
      // if (result.rowsAffected[0] === 1) {
      //   res.sendStatus(200)
      // }
    })
    // If there's an error, return that with some description
    .catch(err => {
      res.send({
        Error: err
      })
    })
})






module.exports = testRouter
