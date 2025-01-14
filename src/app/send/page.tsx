'use client'
import { useState, useMemo, useEffect, use } from 'react'
import { useAccount, usePublicClient } from 'wagmi'
import { parseUnits, erc20Abi, Address } from 'viem'
import { sepolia } from 'viem/chains'
import { useWormholeSend } from '@/hooks/useWormhole'
import { useErc20ApprovedBalance, useErc20Approve } from '@/hooks/useErc20'
import Card from '@/components/Card'
import { ETH_CHAINS } from '@/utils/network'
import { RECEIVER_CONTRACT_ADDRESSES, WORMHOLE_SENDER_SEPOLIA } from '@/utils/constants/addresses'
import { abi } from '@/utils/abis/cross-chain-sender-abi'
import { useReadContract } from 'wagmi'
import { wormholeSendableTokens } from '@/utils/constants'
import { UserAllowanceAmount } from '@/types/general'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import Button from '@/components/Button'
import TokenAndChain from '@/app/send/components/TokenAndChain'

export default function Send() {
  const [amount, setAmount] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [toChain, setToChain] = useState(ETH_CHAINS[0])
  const [fromChain, setFromChain] = useState(ETH_CHAINS[1])
  const [selectedFromToken, setSelectedFromToken] = useState(wormholeSendableTokens[0])
  const [selectedToToken, setSelectedToToken] = useState(wormholeSendableTokens[0])
  const [isFromTokenAndChainOpen, setIsFromTokenAndChainOpen] = useState(false)
  const [isToTokenAndChainOpen, setIsToTokenAndChainOpen] = useState(false)
  const [receipent, setRecepient] = useState('')

  const { address, chain } = useAccount()
  const { writeContractAsync: sendWrite } = useWormholeSend()
  const { writeContractAsync: erc20ApproveWrite } = useErc20Approve()

  const router = useRouter()
  const { isRegistered } = useAuth()

  useEffect(() => {
    if (!isRegistered) {
      router.push('/register')
    }
  }, [isRegistered, router])

  const publicClient = usePublicClient({
    chainId: sepolia.id,
  })

  const handleSelectFromToken = (tokenName: string, tokenAddress: Address) => {
    const selectedToken = wormholeSendableTokens.find((token) => token.address === tokenAddress)
    if (selectedToken) {
      setSelectedFromToken(selectedToken) // Update the selected token
    }
  }

  const handleSelectFromChain = (chainId: number) => {
    const selectedChain = ETH_CHAINS.find((chain) => chain.id === chainId)
    if (selectedChain) {
      setFromChain(selectedChain)
    }
  }

  const handleSelectToToken = (tokenName: string, tokenAddress: Address) => {
    const selectedToken = wormholeSendableTokens.find((token) => token.address === tokenAddress)
    if (selectedToken) {
      setSelectedToToken(selectedToken)
    }
  }

  // Handlers for chain selection for "To"
  const handleSelectToChain = (chainId: number) => {
    const selectedChain = ETH_CHAINS.find((chain) => chain.id === chainId)
    if (selectedChain) {
      setToChain(selectedChain)
    }
  }

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    const regex = /^[0-9]*[.]?[0-9]*$/
    if (value === '' || regex.test(value)) {
      if (value.length > 1 && value[0] === '0' && value[1] !== '.') {
        setAmount(value.slice(1))
      } else {
        setAmount(value)
      }
    }
  }

  const handleReceipentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRecepient(e.target.value)
  }

  const chainQuote = useReadContract({
    abi,
    address: WORMHOLE_SENDER_SEPOLIA,
    functionName: 'quoteCrossChainDeposit',
    args: [10004],
  })

  const { data: erc20ApprovedBalance, refetch: refetchErc20Allowance } = useErc20ApprovedBalance({
    contractAddress: selectedFromToken?.address,
    spenderAddress: WORMHOLE_SENDER_SEPOLIA,
    ownerAddress: address,
  }) as { data: UserAllowanceAmount; refetch: () => Promise<any> }

  const userErc20ApprovedBalance = useMemo(() => {
    const allowanceBalance = erc20ApprovedBalance as UserAllowanceAmount | undefined
    return allowanceBalance?.toString()
  }, [erc20ApprovedBalance])

  const handleSendStarting = async () => {
    const parsedSendAmount = parseUnits(amount.toString(), selectedFromToken.decimals)
    const parsedSendAmountBigInt = BigInt(parsedSendAmount.toString())
    const userAllowanceBigInt = BigInt(userErc20ApprovedBalance || '0')

    if (parsedSendAmountBigInt > userAllowanceBigInt) {
      handleERC20Approving()
    } else {
      handleSendCrossChain()
    }
  }

  const handleERC20Approving = async () => {
    if (!selectedFromToken || !erc20ApproveWrite || !address) {
      console.error('Missing required data for ERC20 approval')
      return false
    }
    setIsLoading(true)
    try {
      const approveTx = await erc20ApproveWrite({
        abi: erc20Abi,
        address: selectedFromToken.address,
        functionName: 'approve',
        args: [WORMHOLE_SENDER_SEPOLIA, parseUnits((amount || 0).toString(), selectedFromToken.decimals)],
        chain: chain,
        account: address,
      })

      if (!approveTx) {
        console.error('Approval transaction failed to initiate')
        return false
      }

      if (publicClient) {
        const receipt = await publicClient.waitForTransactionReceipt({
          hash: approveTx,
          confirmations: 2,
          timeout: 60000,
        })

        if (receipt.status === 'success') {
          refetchErc20Allowance()
          return true
        } else {
          console.error('Approval transaction failed')
          return false
        }
      } else {
        console.error('Public client is not available')
        return false
      }
    } catch (e) {
      console.error('Error during ERC20 approval:', e)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const handleSendCrossChain = async () => {
    console.log('Button clicked, function triggered!')

    if (!address || !amount || !chainQuote.data || !selectedFromToken) {
      console.error('Missing required data for cross-chain deposit')
      return false
    }
    setIsLoading(true)
    try {
      //   const receiverAddress = RECEIVER_CONTRACT_ADDRESSES[toChain.id]
      const depositCost = chainQuote.data

      const tx = await sendWrite({
        abi,
        address: WORMHOLE_SENDER_SEPOLIA,
        functionName: 'sendCrossChainDeposit',
        args: [
          10004, // Wormhole chain ID
          '0xe3F3Fb3a7a5B046298817f0AB073a659f68cbdB3', // targetReceiver
          receipent, // recipient
          parseUnits(amount, selectedFromToken.decimals), // amount to send
          selectedFromToken.address, // IERC20 token address
        ],
        chain: chain,
        account: address,
        value: depositCost,
      })

      if (!tx) {
        console.error('Cross-chain deposit transaction failed to initiate')
        return false
      }

      console.log('Transaction sent:', tx)

      if (publicClient) {
        const receipt = await publicClient.waitForTransactionReceipt({
          hash: tx,
          confirmations: 2,
          timeout: 120000,
        })

        if (receipt.status === 'success') {
          console.log('Cross-chain deposit transaction successful')
          return true
        } else {
          console.error('Cross-chain deposit transaction failed')
          return false
        }
      } else {
        console.error('Public client is not available')
        return false
      }
    } catch (error) {
      console.error('Error sending cross-chain deposit:', error)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className='w-full min-h-screen flex items-center justify-center py-24'>
      <Card>
        <div className='flex flex-col gap-12 w-full justify-center items-center py-4'>
          <h4 className='font-bold opacity-90 text-3xl lg:text-5xl text-center py-3'>Send</h4>
          <div className='flex flex-col gap-3 text-lg w-full'>
            <span className='opacity-60 text-sm'>From</span>
            <TokenAndChain
              isOpen={isFromTokenAndChainOpen}
              chainName={fromChain.name}
              tokenName={selectedFromToken.name}
              onSelectToken={handleSelectFromToken}
              onSelectChain={handleSelectFromChain}
              onClose={() => setIsFromTokenAndChainOpen(false)}
            />
            <span className='opacity-60 text-sm mt-6'>To</span>
            {/* <TokenAndChain
              isOpen={isToTokenAndChainOpen}
              chainName={toChain.name}
              tokenName={selectedToToken.name}
              onSelectToken={handleSelectToToken}
              onSelectChain={handleSelectToChain}
              onClose={() => setIsToTokenAndChainOpen(false)}
              disabled
            /> */}
            <input
              className='h-16 text-xl rounded-md px-4 bg-zinc-800 w-full focus:outline-none focus:ring-0'
              value={receipent}
              onChange={handleReceipentChange}
              placeholder='Enter Address'
            />
            <span className='opacity-60 text-sm mt-6'>Amount</span>
            <input
              className='h-16 text-xl rounded-md px-4 bg-zinc-800 w-full focus:outline-none focus:ring-0'
              value={amount}
              onChange={handleAmountChange}
              placeholder='0.0'
              inputMode='decimal'
            />

            <Button onClick={() => handleSendStarting()} isLoading={isLoading}>
              Submit
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
