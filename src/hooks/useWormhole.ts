import { useWriteContract, useReadContract } from 'wagmi'
import { abi } from '@/utils/abis/cross-chain-sender-abi'
import { Address } from 'viem'

interface CalculateQuote {
  address: Address
  chainId: number
}

export function useWormholeSend() {
  return useWriteContract()
}

export function useCalculateQuote({ address, chainId }: CalculateQuote) {
  return useReadContract({
    address: address,
    abi: abi,
    functionName: 'quoteCrossChainDeposit',
    args: [chainId],
  })
}
