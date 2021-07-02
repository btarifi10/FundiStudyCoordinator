/* eslint-env jest */
'use strict'

/* ------------------------------ Description ----------------------------------
This file contains the tests for rating.test.js and subsequently
tests the logic behind the ratings.

/* --------------------------------------------------------------------------- */

import { ratingCalculation } from '../public/scripts/rating-helpers.js'

describe('Rating is correctly updated', () => {
  test('Get the expected value returned after averaging for an originally NULL rating', () => {
    const oldRating = 0
    const numberRatings = 0
    const rating = 5
    const result = ratingCalculation(oldRating, numberRatings, rating)
    expect(result).toEqual(5)
  })

  test('Get the expected value returned after averaging for rating with one previous rating', () => {
    const oldRating = 0
    const numberRatings = 1
    const rating = 5
    const result = ratingCalculation(oldRating, numberRatings, rating)
    expect(result).toEqual(2.5)
  })

  test('Get the expected value returned after averaging for rating with more than one rating', () => {
    const oldRating = 2
    const numberRatings = 2
    const rating = 5
    const result = ratingCalculation(oldRating, numberRatings, rating)
    expect(result).toEqual(3)
  })
})
