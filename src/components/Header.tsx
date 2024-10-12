import React from 'react'
import Link from 'next/link'
import { Connect } from './Connect'

export function Header() {
  return (
    <div className='fixed left-0 right-0 lg:w-[70%] mx-auto py-4 lg:py-5 px-6 flex items-center justify-between'>
      <div className='flex gap-2'>
        <Link href='/' className='mr-10 flex items-center'>
          <h2 className='hover:opacity-70 duration-200 text-2xl font-semibold'>CoverageFi</h2>
        </Link>
        <div className='hidden lg:flex gap-6 [&>*]:cursor-pointer'>
          <span className='opacity-60 hover:opacity-100 duration-200 px-4 py-2 hover:bg-buttonBg/60 rounded-3xl'>
            Send
          </span>
          <span className='opacity-60 hover:opacity-100 duration-200 px-4 py-2 hover:bg-buttonBg/60 rounded-3xl'>
            About
          </span>
          <span className='opacity-60 hover:opacity-100 duration-200 px-4 py-2 hover:bg-buttonBg/60 rounded-3xl'>
            Docs
          </span>
        </div>
      </div>

      <Connect />
    </div>
  )
}
