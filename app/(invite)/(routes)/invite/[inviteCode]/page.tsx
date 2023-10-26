import { redirect } from "next/navigation";

import { db } from "@/lib/db";
import { currentProfile } from "@/lib/current-profile";
import AcceptInvite from "@/components/AcceptInvite";

interface InviteCodePageProps {
  params: {
    inviteCode: string;
  };
};

const InviteCodePage = async ({
  params
}: InviteCodePageProps) => {
  const profile = await currentProfile();

  if (!profile) {
    return redirect("/")
  }

  if (!params.inviteCode) {
    return redirect("/");
  }

  const existingServer = await db.server.findFirst({
    where: {
      inviteCode: params.inviteCode,
      members: {
        some: {
          userId: profile.id
        }
      }
    }
  });

  if (existingServer) {
    return redirect(`/servers/${existingServer.id}`);
  }

  const server = await db.server.findUnique({
    where : {
      inviteCode : params.inviteCode
    },
    include : {
      members : true,
    }
  })

  if(!server) return redirect("/");
  
  return (
    <div className="grid place-content-center h-screen w-screen">
      <AcceptInvite server={server}/>
    </div>
  )
}
 
export default InviteCodePage;