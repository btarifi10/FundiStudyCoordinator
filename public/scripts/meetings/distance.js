function calcDistance (point1, point2) {
  // convert the latitude an longitude from degrees to radians
  const lat1 = point1.lat * Math.PI / 180
  const lng1 = point1.lng * Math.PI / 180
  const lat2 = point2.lat * Math.PI / 180
  const lng2 = point1.lng * Math.PI / 180
  const EarthRadius = 6371009 // in meters

  const deltaLat = lat2 - lat1
  const deltaLng = lng2 - lng1

  const a = Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2)
  const b = Math.cos(lat1) * Math.cos(lat2) * Math.sin(deltaLng / 2) * Math.sin(deltaLng / 2)
  const c = a + b
  return (2 * EarthRadius * Math.asin(Math.sqrt(c)))
}

export {
  calcDistance
}
