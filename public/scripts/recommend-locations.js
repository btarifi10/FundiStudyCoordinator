'use strict'

const WITS_ADDRESS = '1 Jan Smuts Ave, Braamfontein, Johannesburg, 2000'

// Fetch member addresses
function getMemberAddresses (group) {
  return fetch(`/get-member-addresses?group=${group}`)
    .then(res => res.json())
}

// Compute the minimum distance
function getMinimimumDestination (group, DMService) {
  // First get the addresses
  async function getAddresses () {
    const addr = await getMemberAddresses(group)
    return formatAddresses(addr)
  }

  let addresses = null
  async function getMinimumAddress () {
    // Wait for the addresses
    addresses = await getAddresses()
    if (addresses) {
      const addressList = addresses.map(a => a.address)

      // Get the distance matrix
      const distMatrixRaw = await getDistanceMatrix(addressList, addressList, DMService)
      // extract relevant data per location
      const distancesPerOrigin = extractDistanceMatrixData(distMatrixRaw)
      // determine total distance to each address
      const totalDistancePerOrigin = getTotalDistanceToOrigin(distancesPerOrigin)
      // extract minimum
      return totalDistancePerOrigin.reduce((prev, current) => (prev.totalDistance < current.totalDistance) ? prev : current)
    } else return null
  }

  return getMinimumAddress()
}

// Get the addresses and then filter it by username. Return null
// if the user has no address linked
function getUserDestination (group, username) {
  async function getAddresses () {
    const addr = await getMemberAddresses(group)
    return formatAddresses(addr)
  }

  return getAddresses().then(addr => {
    if (addr) return addr.find(a => a.username.trim() === username.trim())
    else { return null }
  })
}

function getUniDestination () {
  return WITS_ADDRESS
}

// Format address fields to one string
function formatAddresses (addresses) {
  const formattedAddresses = addresses.map(a => {
    if (a.address_line_1) {
      return {
        username: a.username,
        address: `${a.address_line_1}, ${a.address_line_2}, ${a.city}, ${a.postal_code}`
      }
    } else return null
  })

  const addr = formattedAddresses.filter(a => a !== null)
  if (addr.length > 0) return addr
  else return null
}

function getDistanceMatrix (originList, destList) {
  return new Promise((resolve, reject) => {
    const origins = originList.join('|')
    const destinations = destList.join('|')

    try {
      fetch(`/get-distance-matrix?origins=${origins}&destinations=${destinations}`)
        .then(res => res.json())
        .then(data => {
          console.log(data)
          resolve(data)
        })
    } catch (error) {
      reject(error)
    }
  })
}

// Only extract the addresses and list of travel distances for each one
function extractDistanceMatrixData (distMat) {
  const origins = distMat.origin_addresses
  const destinations = distMat.destination_addresses
  const rows = distMat.rows

  const addrDistances = []
  for (let i = 0; i < origins.length; i = i + 1) {
    const d = []
    rows[i].elements.forEach(e => d.push(e.distance.value))
    addrDistances.push({
      address: origins[i],
      distances: d
    })
  }

  return addrDistances
}

// Sum up the lists of travel distances
function getTotalDistanceToOrigin (distPerOrigin) {
  return distPerOrigin.map(element => {
    return {
      address: element.address,
      totalDistance: element.distances.reduce((a, b) => a + b, 0)
    }
  })
}

export { getMinimimumDestination, getUserDestination, getUniDestination }
