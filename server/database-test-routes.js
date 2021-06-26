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

/* ---------------------------- Screening Test Routes ---------------------------- */

// Clear all screening entries
testRouter.get('/delete-screening', function (req, res) {
  db.pools
    .then((pool) => {
      return pool.request()
        .query('DELETE FROM screening')
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

// Determines that the correct value was entered into the screening table
testRouter.get('/screening', function (req, res) {
  db.pools
    .then((pool) => {
      return pool.request()
        .query(`select passed from screening
                where user_id = 4;`)
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

/* -------------------------------------------------------------------------- */

// Resets the ratings to the agreed start values
testRouter.get('/reset-ratings', function (req, res) {
  db.pools
    .then((pool) => {
      return pool.request()
        .query(`UPDATE users SET rating = CASE user_id
                      WHEN 4 THEN 5
                      WHEN 28 THEN 3.5
                      ELSE NULL 
                    END, 
                      number_ratings = CASE user_id
                      WHEN 4 THEN 1 
                      WHEN 28 THEN 2 
                      ELSE NULL
                  END; `)
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
        DELETE FROM messages WHERE group_id IN (SELECT group_id FROM groups WHERE group_name='NewGroup1')
        DELETE FROM action_log
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

module.exports = testRouter
