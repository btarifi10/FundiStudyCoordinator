/* eslint-env jest */
'use strict'

/* ------------------------------ Description ----------------------------------
This file contains the tests for chat-members.js, which contains the
functions that manage the list of all active members currently within a group
chat on the server. This functionality is used to display a live list of chat
members on the right sidebar in any group chat. On the server, this list is
implemented via a single array containing ALL members currently in a group chat
across ALL groups on the server. This array need not be persistent as it is a
live feature that is only useful while the server is running.
*/

/* ------------------------------ Requirements ------------------------------ */

const {
  addChatMember,
  getCurrentMember,
  removeChatMember,
  getChatMembers
} = require('../server/group-chat/chat-members')

/* -------------------------- Imports and Requires -------------------------- */

describe('Members can be added to the list and retrieved via their id', () => {
  test('Trying to get a user from an empty list returns an empty array', () => {
    const id = 42

    expect(getChatMembers(id)).toEqual([])
  })

  // test('Trying to get a user that does not exist returns an empty array', () => {
  //   const member = addChatMember(1, 'Archibald', 'England')
  //   addChatMember(2, 'James', 'Ireland')
  //   const id = 42

  //   expect(getChatMembers(1)).toEqual(member)
  // })
})
