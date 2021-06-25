'use strict'

// Retrieves the username and group from
const { username, group } = Qs.parse(location.search, {
  ignoreQueryPrefix: true
})

// Gets the user selected member from the drop down list
const selectMembers = document.getElementById('memberSelection')

// Populates the dropdown list with the names of the members for this specific group
document.addEventListener('DOMContentLoaded', function () {
  fetch(`/get-members?group=${group}&username=${username}`)//  , {
    .then(response => response.json())
    .then(data => {
      populateAllMembers(data)
    })
})

// Functionality to create more options to the dropdown list to accomodate the number of users
function populateAllMembers (data) {
  data.recordset.forEach(function ({ username, rating }) {
    const memberName = `${username.trim()}`
    const addedElement = document.createElement('option')
    addedElement.textContent = `${username.trim()} (${rating})`
    addedElement.value = memberName

    selectMembers.appendChild(addedElement)
  })
}

// Calls the function for submission when submit button is clicked
const ratingSubmission = document.getElementById('submitButton')
ratingSubmission.addEventListener('click', (event) => {
  event.preventDefault()
  submitRating()
})

// Handles the retrieval of the passed rating so as to update based on an average with the current
// rating given
function submitRating () {
  const nameSelected = selectMembers.value.trim()
  console.log(nameSelected)
  fetch(`/get-current?nameSelected=${nameSelected}`)//  , {
    .then(response => response.json())
    .then(data => {
      const ratingInfo = data.recordset[0]
      let newRating = null
      let newNumRating = null
      console.log(ratingInfo)

      if (ratingInfo.length === 0) {
        newRating = getNewRanking()
        newNumRating = 1
      } else {
        newRating = ((ratingInfo.rating * ratingInfo.number_ratings) + getNewRanking()) / (ratingInfo.number_ratings + 1)
        newNumRating = ratingInfo.number_ratings + 1
      }
      const ratingUpdated = {
        newRating: newRating,
        newNumberRanking: newNumRating,
        userName: nameSelected
      }
      postNewRating(ratingUpdated)
    })
}

// Sends back the updated rating to be posted to the database
function postNewRating (ratingUpdated) {
  fetch('/update-ranking', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(ratingUpdated)
  })
  // window.history.back()
}

// Retrieves the new entry for the rating form the checkbox
function getNewRanking () {
  const ratingValue = document.getElementsByName('rating')
  for (let i = 0; i < ratingValue.length; i++) {
    if (ratingValue[i].checked) {
      return parseInt(ratingValue[i].value, 10)
    }
  }
}
