import { Address, createPublicClient, http, erc20Abi, Abi } from 'viem'
import { useReadContract, useReadContracts, useWriteContract } from 'wagmi'

interface useErc20BalancesProps {
  contractAddresses: Address[]
  walletAddress: string
}

interface useErc20ApproveProps {
  contractAddress: Address
  abi: Abi
  functionName: string
  args: [Address, bigint]
}

interface useErc20AllowanceProps {
  contractAddress: Address
  spenderAddress: Address
  ownerAddress: Address
}

// export function useErc20Balances({ contractAddresses, walletAddress }: useErc20BalancesProps) {
//   const hooksPayload = contractAddresses.map((contractAddresses) => ({
//     address: contractAddresses,
//     abi: erc20Abi,
//     functionName: 'balanceOf',
//     args: [walletAddress],
//   }))

//   return useReadContracts({
//     contracts: hooksPayload,
//     query: {
//       enabled: !!walletAddress && !!contractAddresses,
//     },
//   })
// }

export function useErc20Approve() {
  return useWriteContract()
}

export function useErc20ApprovedBalance({ contractAddress, spenderAddress, ownerAddress }: useErc20AllowanceProps) {
  return useReadContract({
    address: contractAddress,
    abi: erc20Abi,
    functionName: 'allowance',
    args: [ownerAddress, spenderAddress],
  })
}
