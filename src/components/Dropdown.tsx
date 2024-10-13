import { useState, useEffect, useRef } from 'react'

function Dropdown({ selectedItem, items, onSelect }) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)

  const toggleDropdown = () => {
    setIsOpen(!isOpen)
  }

  const handleSelect = (item) => {
    onSelect(item)
    setIsOpen(false)
  }

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false)
    }
  }

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <div ref={dropdownRef} className='relative inline-block text-left'>
      <div>
        <button
          type='button'
          onClick={toggleDropdown}
          className='inline-flex w-full justify-between rounded-md border border-light/20 bg-dark/90 py-2 px-4 text-light/90 shadow-sm focus:outline-none focus:ring-2 focus:ring-light/50'>
          {selectedItem.name}
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
      </div>

      {isOpen && (
        <div className='absolute z-10 mt-1 w-full rounded-md bg-dark shadow-lg ring-1 ring-light/10'>
          <ul className='max-h-60 overflow-auto rounded-md py-1 text-light/90'>
            {items.map((item) => (
              <li
                key={item.id}
                onClick={() => handleSelect(item)}
                className={`cursor-pointer select-none py-2 px-4 hover:bg-card ${
                  selectedItem.id === item.id ? 'bg-card text-light/100' : ''
                }`}>
                {item.name}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export default Dropdown
