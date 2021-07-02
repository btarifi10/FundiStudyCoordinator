/* ------------- Calculate the remaining time ------------- */
function getTimeRemaining (chosenTime, current_time) {
  // to seconds
  let sec_remaining = Math.abs(chosenTime.getTime() - current_time.getTime()) / (1000)

  // first calculate thenumber of whole days
  const days_remaining = Math.floor(sec_remaining / 86400)
  sec_remaining -= days_remaining * 86400 // subtract the number of days

  const hours_remaining = Math.floor(sec_remaining / 3600) % 24
  sec_remaining -= hours_remaining * 3600

  const min_remaining = Math.floor(sec_remaining / 60) % 60
  sec_remaining -= min_remaining * 60

  sec_remaining = Math.floor(sec_remaining % 60)
  // }

  return {
    days: days_remaining,
    hours: hours_remaining,
    minutes: min_remaining,
    seconds: sec_remaining
  }
}
export { getTimeRemaining }
