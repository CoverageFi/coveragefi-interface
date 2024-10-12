interface ButtonProps {
  title: string
  onClick?: () => void
}

export default function Button({ title, onClick }: ButtonProps) {
  return (
    <button className='px-4 py-2 rounded-md bg-light text-dark mt-6' onClick={onClick}>
      Button
    </button>
  )
}
