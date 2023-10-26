import { currentProfile } from '@/lib/current-profile'
import { db } from '@/lib/db'
import { redirect } from 'next/navigation'
import React from 'react'

type Props = {params:{serverId:string}}

const ServerHomePage = async ({params :{serverId}}: Props) => {
    const profile = await currentProfile()

    if(!profile) return redirect("/")

    const servers = await db.server.findMany({
        where : {
            members : {
                some : {
                    userId : profile.id
                }
            }
        }
    })

  return (
    <div>Server ID</div>
  )
}

export default ServerHomePage