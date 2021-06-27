/* eslint-env jest */
'use strict'

/* ------------------------------ Description ----------------------------------
This file contains the tests for rating.test.js, which contains the
tests for the logic behind the ratings.

/* --------------------------------------------------------------------------- */
// const ratingCalculation = require('../public/scripts/rating')
// const QSValue = require('https://cdnjs.cloudflare.com/ajax/libs/qs/6.10.1/qs.min.js')

function ratingCalculation (rating, numberRatings, newUserRating) {
  return ((rating * numberRatings) + newUserRating) / (numberRatings + 1)
}

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
