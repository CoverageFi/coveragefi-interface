import React, { FC } from 'react'
import styles from './styles.module.css'
import { AiOutlineLoading3Quarters } from 'react-icons/ai'

interface ButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
  connect?: boolean
  disabled?: boolean
  isLoading?: boolean
}

const Button: FC<ButtonProps> = ({ onClick, children, connect, disabled = false, color, isLoading }) => {
  return (
    <button
      onClick={onClick}
      type='button'
      className='flex items-center justify-center px-4 py-4 font-semibold rounded-md bg-light/80 text-dark hover:bg-light duration-200'
      disabled={disabled}>
      {isLoading ? <AiOutlineLoading3Quarters className='h-7 animate-spin !duration-75' /> : children}
    </button>
  )
}

export default Button
