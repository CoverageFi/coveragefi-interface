import { StaticImageData } from 'next/image'
import { Address } from 'viem'

export interface ERC_20_TOKEN {
  name: string
  symbol: string
  logo: StaticImageData
  address: Address
  chain: number
  isNative?: boolean
  decimals: number
  balance?: number | string
}

export type UserAllowanceAmount = bigint | undefined
