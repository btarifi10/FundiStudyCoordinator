/* eslint-env jest */

const moment = require('moment')

const formatMessage = require('../server/messages')

describe('Format chat message function', () => {
  test('creates a message object given a username and text', () => {
    const inputUsername = 'Archibald Armstrong'
    const inputText = 'Hey James, would you like to hear a joke?'

    const output = {
      username: 'Archibald Armstrong',
      text: 'Hey James, would you like to hear a joke?',
      time: moment().format('HH:mm')
    }

    expect(formatMessage(inputUsername, inputText)).toMatchObject(output)
  })
})
