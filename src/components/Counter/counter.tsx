import React from 'react'
import CounterButton from './counterButton'

interface CounterProps {
  isQuantity?: boolean
  currentQuantity: number
  handleDecreaseQuantity: () => void
  handleIncreaseQuantity: () => void
}

const Counter: React.FC<CounterProps> = ({
  isQuantity,
  currentQuantity,
  handleDecreaseQuantity,
  handleIncreaseQuantity
}) => {
  const isQuantityShow = isQuantity ?? false
  // Jika props isQuantity ada nilainya? (atau tidak null || undifined) maka return true,
  // namun jika null || undifined return nilai false
  return (
    <div className="flex gap-8 items-center">
      {isQuantityShow && <span className="font-semibold">QUANTITY: </span>}
      <div className="flex gap-4 text-base">
        <CounterButton handleAmountQuantity={handleDecreaseQuantity}>-</CounterButton>
        {currentQuantity}
        <CounterButton handleAmountQuantity={handleIncreaseQuantity}>+</CounterButton>
      </div>
    </div>
  )
}

export default Counter
