import { SITE_INFO, SITE_NAME } from '@/utils/site'

export default function Home() {
  return (
    <>
      <div className='min-h-screen flex items-center justify-center flex-col gap-5 lg:gap-6'>
        <h2 className='text-6xl lg:text-[10rem] p-2 lg:p-6 bg-gradient-to-b from-[#E4E4E4] to-[#8b8b8b] bg-clip-text text-transparent'>
          {SITE_NAME}
        </h2>
        <span className='opacity-70 text-xl lg:text-3xl capitalize'>{SITE_INFO}</span>
      </div>
    </>
  )
}
