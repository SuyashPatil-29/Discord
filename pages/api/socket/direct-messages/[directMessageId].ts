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
      const { messageId, serverId, channelId, profileId } = req.query;

      if (!messageId) {
        return res.status(400).json({ error: "Message ID missing" });
      }
      if (!serverId) {
        return res.status(400).json({ error: "Server ID missing" });
      }
      if (!channelId) {
        return res.status(400).json({ error: "Channel ID missing" });
      }

      const server = await db.server.findFirst({
        where: {
          id: serverId as string,
          members: {
            some: {
              userId: profileId as string,
            },
          },
        },
        include: {
          members: true,
        },
      });

      if (!server) {
        return res.status(404).json({ message: "Server not found" });
      }

      const channel = await db.channel.findFirst({
        where: {
          id: channelId as string,
          serverId: serverId as string,
        },
      });

      if (!channel) {
        return res.status(404).json({ message: "Channel not found" });
      }

      const member = server.members.find(
        (member) => member.userId === profileId
      );

      if (!member) {
        return res.status(404).json({ message: "Member not found" });
      }

      let message = await db.message.findFirst({
        where: {
          id: messageId as string,
          channelId: channelId as string,
        },
        include: {
          member: {
            include: {
              User: true,
            },
          },
        },
      });

      if (!message || message.deleted) {
        return res.status(404).json({ message: "Message not found" });
      }

      const isMessageOwner = message.memberId === member.id;
      const isAdmin = member.role === MemberRole.ADMIN;
      const isModerator = member.role === MemberRole.MODERATOR;
      const canModify = isMessageOwner || isAdmin || isModerator;

      if (!canModify) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      message = await db.message.update({
        where: {
          id: messageId as string,
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

      const updateKey = `chat:${channelId}:messages:update`;

      res?.socket?.server?.io?.emit(updateKey, message);
      return res.status(200).json(message);
    } catch (error) {
      console.log("MESSAGE EDIT PAGES API ERROR", error);
      return res.status(500).json({ message: "Something went wrong" });
    }
  }
}
