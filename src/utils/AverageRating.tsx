const AverageRating = (productReviews: []): number => {
  const AVERAGE_RATING = productReviews?.reduce((acc: number, item: any) => item.rating + acc, 0) / productReviews?.length
  return AVERAGE_RATING
}

export default AverageRating
