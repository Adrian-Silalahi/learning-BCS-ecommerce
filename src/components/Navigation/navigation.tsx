import Link from 'next/link'

interface NavigationProps {
  isLoading: boolean
  path: string
  text: string
  children?: React.ReactNode
}

const Navigation: React.FC<NavigationProps> = ({ isLoading, path, text, children }) => {
  return (
    <div>
        <p className="text-sm">
        {text}
        {isLoading
          ? (
              children
            )
          : <Link href={`${path}`} >
          {children}
      </Link>}
      </p>
        </div>
  )
}

export default Navigation
