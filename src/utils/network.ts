import { CaipNetwork } from '@reown/appkit'
import { sepolia, baseSepolia, arbitrumSepolia, Chain } from '@reown/appkit/networks'

let chains = [sepolia as Chain, baseSepolia as Chain, arbitrumSepolia as Chain] as CaipNetwork[]

export const ETH_CHAINS = chains

export const NETWORK_COLORS = {
  sepolia: {
    color: 'green',
    bgVariant: 'bg-green-600',
  },
  arbitrumSepolia: {
    color: 'sky',
    bgVariant: 'bg-sky-600',
  },
  baseSepolia: {
    color: 'blue',
    bgVariant: 'bg-blue-600',
  },
  linea: {
    color: 'slate',
    bgVariant: 'bg-slate-600',
  },
  polygon: {
    color: 'purple',
    bgVariant: 'bg-purple-600',
  },
  optimism: {
    color: 'red',
    bgVariant: 'bg-red-600',
  },
  scroll: {
    color: 'amber',
    bgVariant: 'bg-amber-600',
  },
  other: {
    color: 'gray',
    bgVariant: 'bg-gray-600',
  },
}

export function GetNetworkColor(chain?: string, type: 'color' | 'bgVariant' = 'color') {
  chain = chain?.toLocaleLowerCase()
  if (chain === 'ethereum' || chain === 'mainnet' || chain === 'homestead') return NETWORK_COLORS.sepolia[type]
  if (chain?.includes('arbitrum')) return NETWORK_COLORS.arbitrumSepolia[type]
  if (chain?.includes('base')) return NETWORK_COLORS.baseSepolia[type]
  if (chain?.includes('linea')) return NETWORK_COLORS.linea[type]
  if (chain?.includes('polygon') || chain?.includes('matic')) return NETWORK_COLORS.polygon[type]
  if (chain?.includes('optimism') || chain?.startsWith('op')) return NETWORK_COLORS.optimism[type]
  if (chain?.includes('scroll')) return NETWORK_COLORS.scroll[type]

  return NETWORK_COLORS.other[type]
}
