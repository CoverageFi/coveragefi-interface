export default function Card({ children, className = '' }) {
  return (
    <div className={`w-full lg:max-w-lg bg-opacity-30 bg-card backdrop-blur-sm shadow-xl rounded-lg p-8 ${className}`}>
      {children}
    </div>
  )
}
