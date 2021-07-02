function ratingCalculation (rating, numberRatings, newUserRating) {
  return ((rating * numberRatings) + newUserRating) / (numberRatings + 1)
}

export
{ ratingCalculation }
