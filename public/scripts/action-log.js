'use strict'

function addAction (groupObj) { //{ groupName, description }
  const timestamp = moment()
  const actionObj = { group_name: groupObj.groupName, timestamp: timestamp, description: groupObj.description }
  fetch('/logAction', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(actionObj)
  })
}

export { addAction }
