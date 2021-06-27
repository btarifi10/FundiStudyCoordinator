'use-strict'
import { getTimeRemaining } from '../public/scripts/meetings/load-meetings'

describe('The time difference between two dates can be calculated correctly', () => {
  test('can get the hours', () => {
    const current_time = new Date('Mon, 05 Jul 2021 12:00')
    const time_check = new Date('Mon, 05 Jul 2021 14:00')
    const remaining = getTimeRemaining(time_check, current_time)
    expect(remaining.hours).toEqual(2)
  })
  test('can get the minutes', () => {
    const current_time = new Date('Mon, 05 Jul 2021 12:00')
    const time_check = new Date('Mon, 05 Jul 2021 12:30')
    const remaining = getTimeRemaining(time_check, current_time)
    expect(remaining.minutes).toEqual(30)
  })
  test('can get the seconds', () => {
    const current_time = new Date('Mon, 05 Jul 2021 12:00')
    const time_check = new Date('Mon, 05 Jul 2021 12:00:25')
    const remaining = getTimeRemaining(time_check, current_time)
    expect(remaining.seconds).toEqual(25)
  })
  test('can get the hours,minutes and seconds', () => {
    const current_time = new Date('Mon, 05 Jul 2021 12:00')
    const time_check = new Date('Mon, 05 Jul 2021 14:30:25')
    const remaining = getTimeRemaining(time_check, current_time)
    expect(remaining.seconds).toEqual(25)
    expect(remaining.hours).toEqual(2)
    expect(remaining.minutes).toEqual(30)
  })
})
