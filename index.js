'use strict'

/* Loop through  dropdown buttons to toggle between hiding and showing its dropdown content
- This allows the user to have multiple dropdowns without any conflict */

const dropdown = document.getElementsByClassName('dropdown-btn')
const studyGroups = ['Big Data', 'Software 3', '19th Centuary Spanish Poetry']

// for (let i = 0; i < studyGroups.length; i++) {
// const anchor = document.createElement('a')
// anchor.href = '#'
//  anchor.appendChild(document.createTextNode(studyGroups[i])
//  document.body.appendChild(anchor)
// }
// const dropMenu = document.getElementsByClassName('dropdown-container')

// dropdown.addEventListener('click', function () {
//   for (let i = 0; i < studyGroups.length; i++) {
//     const opt = studyGroups[i]
//     const el = document.createElement('a')
//     el.href = '#'
//     // el.textContent = opt
//     // el.value = opt
//     el.appendChild(document.createTextNode(opt))
//     document.body.appendChild(el)
//   }
// })

const select = document.getElementById('studyGroup')

for (let i = 0; i < studyGroups.length; i++) {
  const opt = studyGroups[i]
  const el = document.createElement('option')
  el.textContent = opt
  el.value = opt
  select.appendChild(el)
}

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
