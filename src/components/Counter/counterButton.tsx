import React from 'react'

interface CounterButtonProps {
  handleAmountQuantity: () => void
  children: React.ReactNode
}

const CounterButton: React.FC<CounterButtonProps> = ({ handleAmountQuantity, children }) => {
  return (
    <button
      onClick={() => { handleAmountQuantity() }}
      className="px-2 border border-slate-200 rounded"
    >
      {children}
    </button>
  )
}

export default CounterButton
