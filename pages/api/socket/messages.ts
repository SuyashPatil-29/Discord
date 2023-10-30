import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { NextApiResponseServerIo } from "@/types/socket";
import { NextApiRequest } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponseServerIo
) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method Not Allowed" });

  try {

    const {profile, content, fileUrl} = req.body
    const {serverId, channelId} = req.query
    
    if(!profile) return res.status(400).json({ error: "No profile" })
    if(!serverId) return res.status(400).json({ error: "No ServerId" })
    if(!channelId) return res.status(400).json({ error: "No chennelId" })
    if(!content) return res.status(400).json({ error: "No Content" })

    const server = await db.server.findFirst({
        where : {
            id : serverId as string,
            members : {
                some :{
                    userId : profile.id
                }
            }
        },
        include : {
            members : true
        }
    })

    if(!server) return res.status(400).json({ error: "No Server" })

    const channel = await db.channel.findFirst({
        where : {
            id : channelId as string,
            serverId : serverId as string
        }
    })

    if(!channel) return res.status(400).json({ error: "No Channel" })
    
    const member = server.members.find((member) => member.userId === profile.id)
    
    if(!member) return res.status(400).json({ error: "No Member" })

    const message = await db.message.create({
        data : {
            content,
            fileUrl,
            channelId : channelId as string,
            memberId : member.id
        },
        include : {
            member : {
                include :{
                    User : true
                }
            }
        }
    })

    const channelKey = `chat:${channelId}:messages`

    res?.socket?.server?.io?.emit(channelKey, message)
    
    return res.status(200).json(message);
  } catch (error) {
    console.log("MESSAGES PAGES API ROUTE", error);
    return res.status(500).json({ error });
  }
}
