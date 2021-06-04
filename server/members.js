// TODO - Replace with database implementation to make chat persistent

// The following functions are not tested because they will be replaced by DB
// implementations

// NOTE:
// Currently this array stores active members across ALL the group chats
// and members are retrieved using their id and filtering functions
const membersInChat = []

// Adds a member to the group chat and returns them as a member object
function addChatMember(id, username, group) {
  const member = { id, username, group }
  membersInChat.push(member)
  return member
}

// Gets the member in the chat based on their id
function getCurrentMember(id) {
  return membersInChat.find(member => member.id === id)
}

// Removes a member from the chat based on their id and returns them
function removeChatMember(id) {
  const index = membersInChat.findIndex(member => member.id === id)

  // If a member with that id was found...
  if (index !== -1) {
    // ...remove and return them
    return membersInChat.splice(index, 1)[0]
  }
}

// Get all the members in the chat
function getChatMembers(group) {
  return membersInChat.filter(member => member.group === group)
}

module.exports = {
  addChatMember,
  getCurrentMember,
  removeChatMember,
  getChatMembers
}
