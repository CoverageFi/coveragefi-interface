import { Address } from 'viem'

type ChainId = number
interface ReceiverContracts {
  [chainId: ChainId]: Address
}

export const WALLET_ABSTRACT_ADDRESS: Address = '0xAaD1191f2Ef0c86F7c9faebfC4C2142DD4485055'
export const WORMHOLE_SENDER_SEPOLIA: Address = '0x497047952A7F275B48D097cB0e8b7Ad843100a2A'

export const USDC_SEPOLIA: Address = '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238'
export const DAI_SEPOLIA: Address = '0x3e622317f8C93f7328350cF0B56d9eD4C620C5d6'

// receiver
export const RECEIVER_CONTRACT_ADDRESSES: ReceiverContracts = {
  10002: '0x123...' as Address, // Ethereum Sepolia
  10004: '0xe3F3Fb3a7a5B046298817f0AB073a659f68cbdB3' as Address, // Base Sepolia
}
