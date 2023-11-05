import { db } from "@/lib/db";
import { NextApiResponseServerIo } from "@/types/socket";
import { NextApiRequest } from "next";
import {Session} from "@prisma/client"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponseServerIo
) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method Not Allowed" });

  try {

    const { profile, content, fileUrl } = req.body;    
    const {conversationId} = req.query;

    console.log(req.query);
    
    
    if (!profile) {
      return res.status(401).json({ error: "Unauthorized" });
    }    
      
    if (!conversationId) {
      return res.status(400).json({ error: "Conversation ID missing" });
    }
          
    if (!content) {
      return res.status(400).json({ error: "Content missing" });
    }

    const conversation = await db.conversation.findFirst({
      where: {
        id: conversationId as string,
        OR: [
          {
            memberOne: {
              userId: profile.user.id,
            }
          },
          {
            memberTwo: {
              userId: profile.user.id,
            }
          }
        ]
      },
      include: {
        memberOne: {
          include: {
            User: true,
          }
        },
        memberTwo: {
          include: {
            User: true,
          }
        }
      }
    })

    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found" });
    }

    const member = conversation.memberOne.serverId === profile.id ? conversation.memberTwo : conversation.memberOne

    if (!member) {
      return res.status(404).json({ message: "Member not found" });
    }

    const message = await db.directMessage.create({
      data: {
        content,
        fileUrl,
        conversationId: conversationId as string,
        memberId: member.id,
      },
      include: {
        member: {
          include: {
            User: true,
          }
        }
      }
    });

    const channelKey = `chat:${conversationId}:messages`;

    res?.socket?.server?.io?.emit(channelKey, message);

    return res.status(200).json(message);
  } catch (error) {
    console.log("[DIRECT MESSAGES_POST]", error);
    return res.status(500).json({ message: "Internal Error" }); 
  }
}