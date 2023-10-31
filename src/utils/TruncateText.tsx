const TruncateText = (productName: string): string => {
  const MAXIMUM_PRODUCT_NAME_LENGTH = 25

  if (productName?.length < MAXIMUM_PRODUCT_NAME_LENGTH) {
    return productName
  } else {
    return `${productName?.substring(0, 25)}...`
  }
}

export default TruncateText
