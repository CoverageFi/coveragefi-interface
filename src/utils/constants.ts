import { ERC_20_TOKEN } from '@/types/general'
import EthLogo from '@/assets/icons/ethereum.png'
import { USDC_SEPOLIA, DAI_SEPOLIA } from './constants/addresses'

export const wormholeSendableTokens: ERC_20_TOKEN[] = [
  {
    name: 'USD Coin',
    symbol: 'USDC',
    logo: EthLogo,
    decimals: 6,
    chain: 10002,
    isNative: false,
    address: USDC_SEPOLIA,
  },
  {
    name: 'Maker Dai',
    symbol: 'DAI',
    logo: EthLogo,
    decimals: 18,
    chain: 10002,
    isNative: true,
    address: DAI_SEPOLIA,
  },
]
