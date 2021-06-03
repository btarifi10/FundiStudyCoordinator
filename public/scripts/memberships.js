const GROUPS = [
  {
    group_id: '1',
    group_name: 'The Lion King',
    date_joined: new Date('1994'),
    group_num: '200',
    group_url: 'TLK.html',
    group_online: '5'
  },
  {
    group_id: '2',
    group_name: 'Hercules',
    date_joined: new Date('1997'),
    group_num: '150',
    group_url: 'H.html',
    group_online: '10'
  },
  {
    group_id: '3',
    group_name: 'Onward',
    date_joined: new Date('2020'),
    group_num: '50',
    group_url: 'O.html',
    group_online: '30'
  },
  {
    group_id: '4',
    group_name: 'Tangled',
    date_joined: new Date('2010'),
    group_num: '30',
    group_url: 'T.html',
    group_online: '4'
  },
  {
    group_id: '5',
    group_name: 'Zootopia',
    date_joined: new Date('2016'),
    group_num: '10',
    group_url: 'Z.html',
    group_online: '5'
  },
  {
    group_id: '6',
    group_name: 'Coco',
    date_joined: new Date('2017'),
    group_num: '3',
    group_url: 'C.html',
    group_online: '1'
  }
]

let userGroups = null

document.addEventListener('DOMContentLoaded', function () {
  fetch('http://localhost:3000/getAll')
    .then(response => response.json())
    .then(data => {
      userGroups = data
      loadHTMLTable(userGroups)
    })
    // .then(data => console.log(data))
  // loadHTMLTable([''])
})

document.querySelector('table tbody').addEventListener('click', function (event) {
  if (event.target.className == 'delete-row-btn') {
    LeaveGroup(event.target.dataset.group_id)
  }
  if (event.target.className == 'navigate-group-btn') {
    handleNavigation(event.target.dataset.group_id)
  }
})

function handleNavigation () {
  location.href = 'memberships.html'
}

const membBtn = document.querySelector('#membership-btn')
membBtn.onclick = function () {
  loadHTMLTable(GROUPS)
  // location.href=("http://127.0.0.1:5500/views/home.html");
}

function loadHTMLTable (data) {
  const table = document.querySelector('table tbody'); 5

  if (data.length === 0) {
    table.innerHTML = "<tr><td class='no-data' colspan='7'>No Memberships</td></tr>"
    return
  }

  let tableHtml = ''

  data.forEach(function ({ group_id, group_name, date_joined, group_num, group_online, group_url }) {
    tableHtml += '<tr>'
    tableHtml += `<td id='${group_id}-id'>${group_id}</td>`
    tableHtml += `<td id = '${group_id}-group-name'><a href= ${group_url} id='${group_id}-url'>${group_name}</a></td>` //  tableHtml += `<td>${group_name}</td>`;
    tableHtml += `<td id = '${group_id}-date-joined'>${new Date(date_joined).toLocaleString()}</td>`
    tableHtml += `<td id = '${group_id}-num-memb'>${group_num}</td>`
    tableHtml += `<td id = '${group_id}-num-online'>${group_online}</td>`
    tableHtml += `<td><button class="navigate-group-btn" data-id=${group_id}>Navigate</td>`
    tableHtml += `<td><button class="delete-row-btn" data-id=${group_id}>Leave</td>`
    tableHtml += '</tr>'
  })

  table.innerHTML = tableHtml
}

function LeaveGroup (group_id) {
  fetch('http://localhost:3000/leaveGroup/' + group_id, {
    method: 'DELETE'
  })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        location.reload()
      }
    })
}
