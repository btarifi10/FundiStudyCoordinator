'use strict'

const selectMembers = document.getElementById('memberSelection')

document.addEventListener('DOMContentLoaded', function () {
  fetch('http://localhost:3000/get-members')//  , {
    .then(response => response.json())
    .then(data => {
      console.log(data)
      populateAllMembers(data)
    })
})

// function getGroupNumber () {
//   const groupId = {
//     // replace with actual group_id
//     group_id: 128
//   }

//   return groupId
// }

// function postGroupId () {
//   fetch('/get-members', {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json'
//     },
//     body: JSON.stringify(getGroupNumber())
//   })
// }

function populateAllMembers (data) {
  data.recordset.forEach(function ({ first_name, last_name }) {
    const memberName = `${first_name} ${last_name}`
    const addedElement = document.createElement('option')
    addedElement.textContent = memberName
    addedElement.value = memberName

    selectMembers.appendChild(addedElement)
  })
}

function submitRating () {


}
