import { db } from "@/lib/db";
import { NextApiResponseServerIo } from "@/types/socket";
import { NextApiRequest } from "next";
import { MemberRole } from "@prisma/client";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponseServerIo
) {
  if (req.method !== "DELETE" && req.method !== "PATCH") {
    return res.status(405).json({ message: "Method not allowed" });
  }
  if (req.method === "PATCH") {
    try {
      const { content, url, profile } = req.body;
      const { directMessageId, conversationId } = req.query;

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
        where : {
          id : conversationId as string,
          OR : [
            {
              memberOne : {
                userId : profile.user.id
              }
            },
            {
              memberTwo : {
                userId : profile.user.id
              }
            }
          ]
        },
        include : {
          memberOne : {
            include : {
              User : true
            }
          },
          memberTwo : {
            include : {
              User : true
            }
          }
        }
      })

      if (!conversation) {
        return res.status(404).json({ message: "Conversation not found" });
      }

      const member = conversation.memberOne.userId === profile.user.id ? conversation.memberOne : conversation.memberTwo;

      if (!member) {
        return res.status(404).json({ message: "Member not found" });
      }

      let directMessage = await db.directMessage.findFirst({
        where: {
          id: directMessageId as string,
          conversationId: conversationId as string,
        },
        include: {
          member: {
            include: {
              User: true,
            },
          },
        },
      });

      if (!directMessage || directMessage.deleted) {
        return res.status(404).json({ directMessage: "directMessage not found" });
      }

      const isMessageOwner = directMessage.memberId === member.id;
      const isAdmin = member.role === MemberRole.ADMIN;
      const isModerator = member.role === MemberRole.MODERATOR;
      const canModify = isMessageOwner || isAdmin || isModerator;

      if (!canModify) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      if (req.method === "PATCH") {
        if (!isMessageOwner) {
          return res.status(401).json({ error: "Unauthorized" });
        }

        directMessage = await db.directMessage.update({
          where: {
            id: directMessageId as string,
          },
          data: {
            content,
          },
          include: {
            member: {
              include: {
                User: true,
              },
            },
          },
        });
      }

      const updateKey = `chat:${directMessageId}:messages:update`;

      res?.socket?.server?.io?.emit(updateKey, directMessage);

      return res.status(200).json(directMessage);
    } catch (error) {
      console.log("MESSAGE EDIT PAGES API ERROR", error);
      return res.status(500).json({ message: "Something went wrong" });
    }
  }


  if (req.method === "DELETE") {
    try {
      const { conversationId, directMessageId, profileId } = req.query;
      console.log(req.query);

      if (!conversationId) {
        return res.status(400).json({ error: "Message ID missing" });
      }
      if (!directMessageId) {
        return res.status(400).json({ error: "Server ID missing" });
      }

      const conversation = await db.conversation.findFirst({
        where : {
          id : conversationId as string,
          OR : [
            {
              memberOne : {
                userId : profileId as string
              }
            },
            {
              memberTwo : {
                userId : profileId as string
              }
            }
          ]
        },
        include : {
          memberOne : {
            include : {
              User : true
            }
          },
          memberTwo : {
            include : {
              User : true
            }
          }
        }
      })

      if (!conversation) {
        return res.status(404).json({ message: "Conversation not found" });
      }

      const member = conversation.memberOne.userId === profileId as string ? conversation.memberOne : conversation.memberTwo;

      if (!member) {
        return res.status(404).json({ message: "Member not found" });
      }

      let directMessage = await db.directMessage.findFirst({
        where: {
          id: directMessageId as string,
          conversationId: conversationId as string,
        },
        include: {
          member: {
            include: {
              User: true,
            },
          },
        },
      });

      if (!directMessage || directMessage.deleted) {
        return res.status(404).json({ directMessage: "directMessage not found" });
      }

      const isMessageOwner = directMessage.memberId === member.id;
      const isAdmin = member.role === MemberRole.ADMIN;
      const isModerator = member.role === MemberRole.MODERATOR;
      const canModify = isMessageOwner || isAdmin || isModerator;

      if (!canModify) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      directMessage = await db.directMessage.update({
        where: {
          id: directMessageId as string,
        },
        data: {
          fileUrl: null,
          content: "This message has been deleted.",
          deleted: true,
        },
        include: {
          member: {
            include: {
              User: true,
            },
          },
        },
      });

      const updateKey = `chat:${conversationId}:messages:update`;

      res?.socket?.server?.io?.emit(updateKey, directMessageId);
      return res.status(200).json(directMessageId);
    } catch (error) {
      console.log("MESSAGE EDIT PAGES API ERROR", error);
      return res.status(500).json({ message: "Something went wrong" });
    }
  }
}
