'use client'
import { createContext, useContext, useEffect, useState } from 'react'
import { useAccount, useDisconnect, useReadContract } from 'wagmi'
import { abi } from '@/utils/abis/account-abstract-abi'

import { WALLET_ABSTRACT_ADDRESS } from '@/utils/constants/addresses'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { address, isConnected } = useAccount()
  const { disconnect } = useDisconnect()

  const [isRegistered, setIsRegistered] = useState(false)
  const [username, setUsername] = useState<string | null>(null)

  const { data: userRegistered } = useReadContract({
    address: WALLET_ABSTRACT_ADDRESS,
    abi: abi,
    functionName: 'isUserRegistered',
    args: [address],
    query: {
      enabled: !!address,
    },
  })

  const { data: fetchedUsername } = useReadContract({
    address: WALLET_ABSTRACT_ADDRESS,
    abi: abi,
    functionName: 'getUsername',
    args: [address],
    query: {
      enabled: isRegistered && !!address,
    },
  })

  useEffect(() => {
    setIsRegistered(!!userRegistered)
    if (userRegistered && fetchedUsername) {
      setUsername(fetchedUsername.toString())
    } else {
      setUsername(null)
    }
  }, [userRegistered, fetchedUsername])

  return <AuthContext.Provider value={{ isRegistered, username, disconnect }}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
