interface ContainerProps {
  children: React.ReactNode
  className?: string
}

const Container: React.FC<ContainerProps> = ({ children, className }) => {
  return <div className={`${className} max-w-[1920px] mx-auto px-4 md:px-2 xl:px-10 `}>{children}</div>
}

export default Container
