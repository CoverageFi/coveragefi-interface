import { useEffect, useRef, useState } from 'react'
import { Address } from 'viem'
import { wormholeSendableTokens } from '@/utils/constants'
import { ETH_CHAINS } from '@/utils/network'

interface TokenAndChainProps {
  isOpen: boolean
  chainName: string
  tokenName: string
  onSelectToken: (tokenName: string, tokenAddress: Address) => void
  onSelectChain: (chainId: number) => void
  onClose: () => void
  disabled?: boolean
}

export default function TokenAndChain({
  isOpen,
  chainName,
  tokenName,
  onSelectToken,
  onSelectChain,
  onClose,
  disabled,
}: TokenAndChainProps) {
  const [isOptionsOpen, setIsOptionsOpen] = useState(false)
  const [selectedToken, setSelectedToken] = useState<Address | null>(null)
  const [selectedChain, setSelectedChain] = useState<number | null>(null)

  const containerRef = useRef<HTMLDivElement | null>(null)

  const handleTokenSelect = (name: string, address: Address) => {
    setSelectedToken(address)
    onSelectToken(name, address)
    if (selectedChain) {
      onClose()
    }
  }

  const handleChainSelect = (id: number) => {
    setSelectedChain(id)
    onSelectChain(id)
    if (selectedToken) {
      onClose()
    }
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOptionsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [containerRef])

  return (
    <div ref={containerRef}>
      <button
        className={`w-full h-24 bg-zinc-800 rounded-md px-4 flex cursor-pointer hover:bg-zinc-800/80 duration-200 items-center justify-between ${disabled ? 'cursor-not-allowed opacity-85 blur-[2px]' : ''}`}
        onClick={() => setIsOptionsOpen(!isOptionsOpen)}
        disabled={disabled}>
        <div className='flex gap-5 w-48 text-start'>
          <span className='w-12 h-12 rounded-full bg-light/10' />
          <div className='flex flex-col'>
            <span className='text-base font-semibold'>{tokenName}</span>
            <span className='text-xs opacity-70'>{chainName}</span>
          </div>
        </div>
        <svg
          className={`ml-2 h-5 w-5 text-light/70 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          xmlns='http://www.w3.org/2000/svg'
          viewBox='0 0 20 20'
          fill='currentColor'
          aria-hidden='true'>
          <path
            fillRule='evenodd'
            d='M5.293 7.707a1 1 0 011.414 0L10 11.414l3.293-3.707a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z'
            clipRule='evenodd'
          />
        </svg>
      </button>

      {isOptionsOpen && (
        <div className='fade-in bg-zinc-900 p-4 rounded-md'>
          <div className='mb-4'>
            <h3 className='text-lg font-semibold'>Select Token</h3>
            {wormholeSendableTokens.map((token) => (
              <div
                key={token.address}
                className={`flex items-center gap-4 cursor-pointer p-2 rounded-md ${selectedToken === token.address ? 'bg-zinc-800' : 'hover:bg-zinc-800/20'}`}
                onClick={() => handleTokenSelect(token.name, token.address)}>
                <span>{token.name}</span>
                <span className='ml-auto text-sm opacity-70'>{token.symbol}</span>
              </div>
            ))}
          </div>

          <div>
            <h3 className='text-lg font-semibold'>Select Chain</h3>
            {ETH_CHAINS.map((chain) => (
              <div
                key={chain.id}
                className={`flex items-center gap-4 cursor-pointer p-2 rounded-md ${selectedChain === chain.id ? 'bg-zinc-800' : 'hover:bg-zinc-800/20'}`}
                onClick={() => handleChainSelect(Number(chain.id))}>
                <span>{chain.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
