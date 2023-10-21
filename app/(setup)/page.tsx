import InitialModal from '@/components/modals/InitialModal';
import { db } from '@/lib/db';
import { initialProfile } from '@/lib/initial-profile'
import { redirect } from 'next/navigation';
import React from 'react'

type Props = {}

const SetupPage = async (props: Props) => {

  const profile = await initialProfile();

  const server = await db.server.findFirst({
    where: {
        userId : profile.id
    }
  })

  if(server) return redirect(`/servers/${server.id}`)

  return <InitialModal />;
}

export default SetupPage