'use strict'

/* Loop through  dropdown buttons to toggle between hiding and showing its dropdown content
- This allows the user to have multiple dropdowns without any conflict */

const dropdown = document.getElementsByClassName('dropdown-btn')
const dropMenu = document.getElementsByClassName('dropdown-container')
const studyGroups = ['Big Data', 'Software 3', '19th Centuary Spanish Poetry']

// working select code
const select = document.getElementById('studyGroup')
for (let i = 0; i < studyGroups.length; i++) {
  const opt = studyGroups[i]
  const el = document.createElement('option')
  el.textContent = opt
  el.value = opt
  select.appendChild(el)
}

// Buggy code for using the Bootstrap dropdown menu
// Continuously adds Big Data to the list on every click

// function populateGroups () {
//   for (let i = 0; i < studyGroups.length; i++) {
//     const groupName = studyGroups[i]
//     console.log(groupName)
//     const addedElement = document.createElement('a')
//     addedElement.textContent = groupName
//     addedElement.value = groupName
//     addedElement.href = '#'
//     if (dropMenu.length === studyGroups.length) { return } else {
//       dropMenu[i].appendChild(addedElement)
//     }
//   }
// }

// for (let i = 0; i < dropdown.length; i++) {
//   dropdown[i].addEventListener('click', function () {
//     this.classList.toggle('active')
//     const dropdownContent = this.nextElementSibling

//     if (dropdownContent.style.display === 'block') {
//       dropdownContent.style.display = 'none'
//     } else {
//       dropdownContent.style.display = 'block'
//     }
//   })
// }
