import { currentProfile } from '@/lib/current-profile'
import { db } from '@/lib/db'
import { redirect } from 'next/navigation'

type Props = {params:{serverId:string}}

const ServerHomePage = async ({params :{serverId}}: Props) => {
    const profile = await currentProfile()

    if(!profile) return redirect("/")

    const server = await db.server.findUnique({
        where : {
            id : serverId,
            members : {
                some : {
                    userId : profile.id
                }
            }
        },
        include : {
            channels : {
                where : {
                    name : "general"
                },
                orderBy : {
                    createdAt : "asc"
                }
            }
        }
    })    
        
    if(server) return redirect(`/servers/${serverId}/channels/${server.channels[0].id}`)

    else return redirect(`/`)
}

export default ServerHomePage