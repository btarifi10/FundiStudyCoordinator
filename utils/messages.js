const moment = require('moment')

// Returns a message object containing the member's username, text and timestamp
function formatMessage (username, text) {
  return {
    username: username,
    text: text,
    time: moment().format('HH:mm')
  }
}

module.exports = formatMessage
