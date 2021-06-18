'use strict'

const { username, group } = Qs.parse(location.search, {
  ignoreQueryPrefix: true
})

const selectMembers = document.getElementById('memberSelection')

document.addEventListener('DOMContentLoaded', function () {
  fetch(`/get-members?group=${group}`)//  , {
    .then(response => response.json())
    .then(data => {
    //   console.log(data)
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

function populateAllMembers (data) {
//   console.log(data)
  data.recordset.forEach(function ({ username }) {
    const memberName = `${username.trim()}`
    const addedElement = document.createElement('option')
    addedElement.textContent = memberName
    addedElement.value = memberName

    selectMembers.appendChild(addedElement)
  })
}

const ratingSubmission = document.getElementById('submitButton')
ratingSubmission.addEventListener('click', (event) => {
  event.preventDefault()
  submitRating()
})

function submitRating () {
  const nameSelected = selectMembers.value.trim()
  fetch(`/get-current?nameSelected=${nameSelected}`)//  , {
    .then(response => response.json())
    .then(data => {
      const ratingInfo = data.recordset[0]
      let newRating = null
      let newNumRating = null

      if (ratingInfo.rating == null) {
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

function postNewRating (ratingUpdated) {
  fetch('/update-ranking', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(ratingUpdated)

  })
}

function getNewRanking () {
  const ratingValue = document.getElementsByName('rating')
  for (let i = 0; i < ratingValue.length; i++) {
    if (ratingValue[i].checked) {
      return parseInt(ratingValue[i].value, 10)
    }
  }
}
