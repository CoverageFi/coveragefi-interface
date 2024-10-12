'use client'
import { useState } from 'react'
import { useAccount } from 'wagmi'
import Card from '@/components/Card'
import { useUsernameRegistration } from '@/hooks/useRegistration'
import { abi } from '@/utils/abis/account-abstract-abi'
import { WALLET_ABSTRACT_ADDRESS } from '@/utils/constants/addresses'

export default function Register() {
  const [username, setUsername] = useState('')
  const { address, chain } = useAccount()
  const { writeContractAsync: usernameWrite, data: userId } = useUsernameRegistration()

  const handleRegister = async () => {
    try {
      let registerTx = null
      if (address && username) {
        registerTx = await usernameWrite({
          abi,
          address: WALLET_ABSTRACT_ADDRESS,
          functionName: 'registerUser',
          args: [username],
          chain,
          account: address,
        })
      }
    } catch (error) {
      console.error('Error registering user:', error)
    }
  }
  return (
    <div className='w-full min-h-screen flex items-center justify-center'>
      <Card>
        <div className='flex flex-col gap-12 w-full justify-center items-center py-4'>
          <h4 className='font-bold opacity-90 text-3xl lg:text-5xl text-center py-3'>Registration</h4>
          <div className='flex flex-col gap-3 text-lg w-full'>
            <input
              className='h-16 text-2xl text-center rounded-md bg-zinc-800 w-full focus:outline-none focus:ring-0'
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder='Enter username'
            />
            <button className='px-4 py-2 rounded-md bg-light text-dark' onClick={() => handleRegister()}>
              Submit
            </button>
          </div>
        </div>
      </Card>
    </div>
  )
}
