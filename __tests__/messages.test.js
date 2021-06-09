/* eslint-env jest */

// TODO - I do not know how to test this properly
// The the function is now defined as a client script, which throws an error
// when I try and export the functions using modules.export()
// As a temporary workaround I have manually added the function below

const moment = require('moment')

describe('Format chat message function', () => {
  test('creates a message object given a username and text', () => {
    const inputUsername = 'Archibald Armstrong'
    const inputText = 'Hey James, would you like to hear a joke?'
    const inputTime = moment()

    const output = {
      username: 'Archibald Armstrong',
      text: 'Hey James, would you like to hear a joke?',
      time: moment(inputTime).format('HH:mm')
    }

    expect(formatChatMessage(inputUsername, inputText, inputTime)).toMatchObject(output)
  })
})

function formatChatMessage (username, text, time) {
  return {
    username: username,
    text: text,
    time: moment(time).format('HH:mm')
  }
}
