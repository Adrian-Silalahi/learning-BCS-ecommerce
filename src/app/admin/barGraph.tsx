'use client'

import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js'
import { Bar } from 'react-chartjs-2'

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend)

interface BarGraphProps {
  dailyOrderData: GraphData[]
}

type GraphData = {
    day: string
    date: string
    totalAmount: number
}

const BarGraph: React.FC<BarGraphProps> = ({ dailyOrderData }) => {
  const labels: string[] = dailyOrderData.map((order) => order.day)
  const amounts: number[] = dailyOrderData.map((order) => order.totalAmount)

  const chartData = {
    labels: labels,
    datasets: [
      {
        label: 'Amount per day',
        data: amounts,
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWith: 1
      }
    ]
  }

  const options = {
    scales: {
      y: {
        beginAtZero: true
      }
    }
  }

  return (<Bar data={chartData} options={options}></Bar>)
}

export default BarGraph
