'use strict'

const selectMembers = document.getElementById('memberSelection')

document.addEventListener('DOMContentLoaded', function () {
  fetch('http://localhost:3000/get-members')//  , {
    .then(response => response.json())
    .then(data => {
      console.log(data)
      populateAllMembers(data)
    })

//   fetch('http://localhost:3000/get-current-rating')//  , {
//     .then(response => response.json())
//     .then(data => {
//       console.log(data)
//       const ratingValue = document.getElementById('rating').value
//         console.log(ratingValue)
//       submitRating(data)
//     })
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
  data.recordset.forEach(function ({ rating, number_ratings }) {
    
    if (rating == null) {
      rating = getNewRanking()
      number_ratings = 1
      //   const groupId = {
//     // replace with actual group_id
//     group_id: 128
//   }
    }else{
        rating= getNewRanking()*number_ratings/(number_ratings+1)
        number_ratings = number_ratings + 1
    }


}
//   )
// }

function getNewRanking(){
    const ratingValue = document.getElementsByName('rating')
    for (let i = 0; i < ratingValue.length; i++) {
      if (ratingValue[i].checked) { alert(ratingValue[i].value) }
    }
    return ratingValue[i].value

}
