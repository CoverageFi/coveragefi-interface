import { useWriteContract, useSimulateContract } from 'wagmi'

interface useWriteContractrProps {
  address: `0x${string}` | undefined
  abi: any
  functionName: any
  args?: any[]
}

export function useWriteOfContract({ address, abi, functionName, args }: useWriteContractrProps) {
  const { error } = useSimulateContract({
    address: address,
    abi: abi,
    functionName: functionName,
    args: args,
  })

  const { writeContract } = useWriteContract()

  return { writeContract }
}
