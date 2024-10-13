'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAccount } from 'wagmi'
import { usePublicClient } from 'wagmi'
import Card from '@/components/Card'
import { useUsernameRegistration } from '@/hooks/useRegistration'
import { abi } from '@/utils/abis/account-abstract-abi'
import { WALLET_ABSTRACT_ADDRESS } from '@/utils/constants/addresses'
import { useAuth } from '@/context/AuthContext'
import Button from '@/components/Button'

export default function Register() {
  const [username, setUsername] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { address, chain } = useAccount()
  const { writeContractAsync: usernameWrite, data: userId } = useUsernameRegistration()

  const router = useRouter()
  const publicClient = usePublicClient()
  const { isRegistered } = useAuth()

  useEffect(() => {
    if (isRegistered) {
      router.push('/send')
    }
  }, [isRegistered, router])

  const handleRegister = async () => {
    if (!address || !username) {
      console.error('Address or username is missing')
      return false
    }
    setIsLoading(true)
    try {
      const registerTx = await usernameWrite({
        abi,
        address: WALLET_ABSTRACT_ADDRESS,
        functionName: 'registerUser',
        args: [username],
        chain,
        account: address,
      })

      if (!registerTx) {
        setIsLoading(false)
        console.error('Transaction failed to initiate')
        return false
      }

      if (publicClient) {
        const receipt = await publicClient.waitForTransactionReceipt({
          hash: registerTx,
          confirmations: 2,
          timeout: 60000,
        })

        if (receipt.status === 'success') {
          setIsLoading(false)
          router.push('/send')
          return true
        } else {
          console.error('Transaction failed')
          setIsLoading(false)
          return false
        }
      } else {
        console.error('Public client is not available')
        setIsLoading(false)
        return false
      }
    } catch (error) {
      console.error('Error registering user:', error)
      setIsLoading(false)
      return false
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
            <Button onClick={() => handleRegister()} isLoading={isLoading}>
              Submit
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
