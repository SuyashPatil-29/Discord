import ChatHeader from '@/components/chat/ChatHeader'
import { getOrCreateConversation } from '@/lib/conversation'
import { currentProfile } from '@/lib/current-profile'
import { db } from '@/lib/db'
import { redirect } from 'next/navigation'
import React from 'react'

type Props = {
  params : {
    memberId : string,
    serverId : string
  }
}

const MemberConversationsPage = async ({params:{memberId,serverId}}: Props) => {

  const profile = await currentProfile()

  if(!profile) return redirect("/")

  const currentMember = await db.member.findFirst({
    where : {
      serverId : serverId,
      userId : profile.id
    },
    include :{
      User : true
    }
  })

  if(!currentMember) return redirect("/")

  const conversation = await getOrCreateConversation(currentMember.id, memberId)

  if(!conversation) return redirect(`/servers/${serverId}`)

  const {memberOne,memberTwo} = conversation

  const otherMember = memberOne.userId === profile.id ? memberTwo : memberOne

  return (
    <div className='bg-white dark:bg-[#313338] flex flex-col h-full'>
      <ChatHeader type="conversation" serverId={serverId} name={otherMember.User.name!} imageUrl={otherMember.User.image!}/>
    </div>
  )
}

export default MemberConversationsPage