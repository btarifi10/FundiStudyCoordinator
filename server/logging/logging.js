// function format the Action

// function poll object to logging object

const db = require('../database-service')
const moment = require('moment')

function formatAction (groupObj) { // takes in { action, groupName, timestamp, description }
  const timestamp = moment().format()
  const actionObj = { action: groupObj.action, group_name: groupObj.groupName, timestamp: timestamp, description: groupObj.description }
  return actionObj
}

function logAction (reqObj, userId) {
  // const reqObj = req.body // {group_name, timestamp, description}
// console.log(inviteList)

// Make a query to the database
  db.pools
  // Run query
    .then((pool) => {
    // 'creation action' regardless of invited members
      return pool.request()
        .input('user_id', db.sql.Int, userId)
        .input('action', db.sql.Char, reqObj.action)
        .input('group_name', db.sql.Char, reqObj.group_name)
        .input('timestamp', db.sql.DateTimeOffset, reqObj.timestamp)
        .input('description', db.sql.VarChar, reqObj.description)
        .query(`
        INSERT INTO action_log (action_id, group_id, user_id,  timestamp, description)
        SELECT action_id, group_id, (@user_id), (@timestamp), (@description)
        FROM groups AS g, actions AS a
        WHERE a.action = (@action)
        AND g.group_name = (@group_name)
        `)
    })
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
