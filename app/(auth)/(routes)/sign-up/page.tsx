import SignUp from '@/components/SignUp'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { ChevronLeft } from 'lucide-react'
import Link from 'next/link'

const page = () => {
  return (
    <div className='absolute inset-0'>
        <div className='h-full max-w-2xl mx-auto flex flex-col items-center justify-center gap-20'>
            <SignUp />
        </div>
    </div>
  )
}

export default page 