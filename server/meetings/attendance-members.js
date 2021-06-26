/* ------------------------------ Description ----------------------------------
This file is very similar to the 'chat-members' file used for the group chat
service. Changes include the addition of the meetingID, position and label
to member array elements.
*/

// Array that stores active members across ALL the group chats
const membersInAttendance = []

/* ------------------------------- Functions ------------------------------- */

// Adds a member to the attendance roster and returns them as a member object
function addMember (id, username, group, meetingID, position, label) {
  const member = { id, username, group, meetingID, position, label }
  membersInAttendance.push(member)
  return member
}

// Gets the member in attendance based on their id
function getCurrentMember (id) {
  if (membersInAttendance.length == 0) {
    const username = 'Default'
    const position = { lat: -27, lng: -26 }
    const member = { position }
    return member
  } else {
    return membersInAttendance.find(member => member.id === id)
  }
}

// Removes a member from the chat based on their id and returns them
function removeMember (id) {
  const index = membersInAttendance.findIndex(member => member.id === id)

  // If a member with that id was found...
  if (index !== -1) {
    // ...remove and return them
    return membersInAttendance.splice(index, 1)[0]
  }
}

function changeMemberPosition (id, newPosition) {
  membersInAttendance.map(member => {
    if (member.id == id) {
      member.position = newPosition
    }
  })
}

// Get all the members in attendance
function getAllMembers (group) {
  return membersInAttendance.filter(member => member.group === group)
}

module.exports = {
  membersInAttendance,
  addMember,
  getCurrentMember,
  removeMember,
  getAllMembers,
  changeMemberPosition
}
