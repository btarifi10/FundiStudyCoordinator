/*!
* Start Bootstrap - Simple Sidebar v6.0.1 (https://startbootstrap.com/template/simple-sidebar)
* Copyright 2013-2021 Start Bootstrap
* Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-simple-sidebar/blob/master/LICENSE)
*/
//
// Scripts
//

let open = true

window.addEventListener('DOMContentLoaded', event => {
  // Toggle the side navigation
  const sidebarToggle = document.body.querySelector('#sidebarToggle')
  if (sidebarToggle) {
    // Uncomment Below to persist sidebar toggle between refreshes
    // if (localStorage.getItem('sb|sidebar-toggle') === 'true') {
    //     document.body.classList.toggle('sb-sidenav-toggled');
    // }
    sidebarToggle.addEventListener('click', event => {
      event.preventDefault()
      document.body.classList.toggle('sb-sidenav-toggled')
      localStorage.setItem('sb|sidebar-toggle', document.body.classList.contains('sb-sidenav-toggled'))
      if (open) {
        sidebarToggle.innerHTML = '<i class="fas fa-chevron-right"></i> Menu'
        open = false
      } else {
        sidebarToggle.innerHTML = '<i class="fas fa-chevron-left"></i>'
        open = true
      }
    })
  }
})
