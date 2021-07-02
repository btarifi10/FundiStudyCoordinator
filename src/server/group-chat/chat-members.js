/* ------------------------------ Description ----------------------------------
This file handles all the active chat members on the server. It contains an
array for storing the active chat members as well as functions that deal with
retrieving, adding and removing members from this array via array filtering
methods. This information does not need to be persistent since it is only
relevant to users currently in a group chat
*/

// Array that stores active members across ALL the group chats
const membersInChat = []

/* ------------------------------- Functions ------------------------------- */

// Adds a member to the group chat and returns them as a member object
function addChatMember (id, username, group) {
  const member = { id, username, group }
  membersInChat.push(member)
  return member
}

// Gets the member in the chat based on their id
function getCurrentMember (id) {
  return membersInChat.find(member => member.id === id)
}

// Removes a member from the chat based on their id and returns them
function removeChatMember (id) {
  const index = membersInChat.findIndex(member => member.id === id)

  // If a member with that id was found...
  if (index !== -1) {
    // ...remove and return them
    return membersInChat.splice(index, 1)[0]
  }
}

// Get all the members in the chat
function getChatMembers (group) {
  return membersInChat.filter(member => member.group === group)
}

module.exports = {
  membersInChat,
  addChatMember,
  getCurrentMember,
  removeChatMember,
  getChatMembers
}
