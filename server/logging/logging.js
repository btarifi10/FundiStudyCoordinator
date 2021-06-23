// function format the Action

// function poll object to logging object

const db = require('../database-service')
const moment = require('moment')

function formatAction (groupObj) { // takes in { action, groupName, timestamp, description }
  const timestamp = moment().format()
  const actionObj = { action: groupObj.action, group_name: groupObj.groupName, timestamp: timestamp, description: groupObj.description }
  return actionObj
}

function logAction (actionObj, userId) {
  // Screening must be logged for every group user is in
  if (actionObj.group_name === '') {
    db.pools
      .then((pool) => {
        // Obtain all group_id's that user is member of
        return pool.request()
          .input('user_id', db.sql.Int, userId)
          .query(`
            SELECT g.group_name
            FROM groups AS g
            INNER JOIN memberships AS m
            ON g.group_id = m.group_id
            WHERE m.user_id = (@user_id)
            `)
      })
      .then(result => {
        const groups = result.recordset

        console.log(groups)

        groups.forEach(group => {
          db.pools
            .then((pool) => {
              // log the screening result for every group the user is in
              return pool.request()
                .input('user_id', db.sql.Int, userId)
                .input('action', db.sql.Char, actionObj.action)
                .input('group_name', db.sql.Char, group.group_name) // ASSUMING THIS WILL WORK based on what is in groups = result.recordset
                .input('timestamp', db.sql.DateTimeOffset, actionObj.timestamp)
                .input('description', db.sql.VarChar, actionObj.description)
                .query(`
            INSERT INTO action_log (action_id, group_id, user_id,  timestamp, description)
            SELECT action_id, group_id, (@user_id), (@timestamp), (@description)
            FROM groups AS g, actions AS a
            WHERE a.action = (@action)
            AND g.group_name = (@group_name)
            `)
            })
        })
      })
  } else {
  // Make a query to the database
    db.pools
    // Run query
      .then((pool) => {
        // 'creation action' regardless of invited members
        return pool.request()
          .input('user_id', db.sql.Int, userId)
          .input('action', db.sql.Char, actionObj.action)
          .input('group_name', db.sql.Char, actionObj.group_name)
          .input('timestamp', db.sql.DateTimeOffset, actionObj.timestamp)
          .input('description', db.sql.VarChar, actionObj.description)
          .query(`
        INSERT INTO action_log (action_id, group_id, user_id,  timestamp, description)
        SELECT action_id, group_id, (@user_id), (@timestamp), (@description)
        FROM groups AS g, actions AS a
        WHERE a.action = (@action)
        AND g.group_name = (@group_name)
        `)
      })
  }
  // Send back the result
//   .then(result => {
//     res.send(result)
//     // console.log('Requests have been sent')
//   })
  // If there's an error, return that with some description
//   .catch(err => {
//     res.send({
//       Error: err
//     })
//   })
}

module.exports = { logAction, formatAction }
