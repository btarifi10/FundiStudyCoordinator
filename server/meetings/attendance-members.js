/* ------------------------------ Description ----------------------------------
This file handles all the active members who are in attendance on the server.
It contains an array for storing the active members as well as functions that
deal with retrieving, adding and removing members from this array via array
filtering methods. This information does not need to be persistent since it is
only relevant to users currently in a group chat
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
  return membersInAttendance.find(member => member.id === id)
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
      console.log(member.position.lat)
      console.log(member.position.lng)
      member.position = newPosition
      console.log(member.position.lat)
      console.log(member.position.lng)
    }
  })
  // // get member index in list
  // const index = membersInAttendance.findIndex(member => member.id === id)
  // // If a member with that id was found...
  // const newMember = { id, username, group, meetingID, newPosition }
  // console.log(newMember)
  // if (index !== -1) {
  //   // ...remove and return them
  //   membersInAttendance.splice(index, 1, [newMember])
  // }
  // return newMember
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
