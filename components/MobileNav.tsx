import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetTrigger
} from "@/components/ui/sheet"
import { Menu } from 'lucide-react'
import NavigationSideBar from './navigation/NavigationSideBar'
import ServerSidebar from './server/ServerSidebar'

type Props = {
serverId :string
}

const MobileNav = ({serverId}: Props) => {
  return (
    <Sheet>
        <SheetTrigger asChild>
            <Button variant='ghost' size="icon" className='md:hidden'>
                <Menu />
            </Button>
        </SheetTrigger>
        <SheetContent side="left" className='p-0 flex gap-0'>
          <div className='w-[72px]'>
            <NavigationSideBar />
          </div>
          <ServerSidebar serverId={serverId}/>
        </SheetContent>
    </Sheet>
  )
}

export default MobileNav