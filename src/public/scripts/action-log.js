'use strict'

function addAction (groupObj) { // takes in { action, groupName, timestamp, description }
  const timestamp = moment()
  const actionObj = { action: groupObj.action, group_name: groupObj.groupName, timestamp: timestamp, description: groupObj.description }
  fetch('/logAction', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(actionObj)
  })
}

export { addAction }
