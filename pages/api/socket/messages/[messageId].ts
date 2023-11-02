import { db } from "@/lib/db";
import { NextApiResponseServerIo } from "@/types/socket";
import { NextApiRequest } from "next";

export default async function handler(req:NextApiRequest, res:NextApiResponseServerIo){
    if(req.method !== "DELETE" && req.method !== "PATCH"){
        return res.status(405).json({message: "Method not allowed"})
    }
    try {
        const { content, url, profile } = req.body;    
        const { messageId ,serverId, channelId } = req.query;
        
        if (!profile) {
          return res.status(401).json({ error: "Unauthorized" });
        }   
        if (!messageId) {
            return res.status(400).json({ error: "Message ID missing" });
        }
        if (!serverId) {
            return res.status(400).json({ error: "Server ID missing" });
        }
        if (!channelId) {
            return res.status(400).json({ error: "Channel ID missing" });
        }
        if (!content) {
            return res.status(400).json({ error: "Content missing" });
        }

        const server = await db.server.findFirst({
            where : {
                id : serverId as string,
                members : {
                    some : {
                        userId : profile.user.id
                    }
                }
            },
            include : {
                members : true
            }
        })

        if(!server){
            return res.status(404).json({message: "Server not found"})
        }

        const channel = await db.channel.findFirst({
            where : {
                id : channelId as string,
                serverId : serverId as string
            }
        })

        if(!channel){
            return res.status(404).json({message: "Channel not found"})
        }

        const member = server.members.find((member)=>member.userId === profile.user.id)

        if(!member){
            return res.status(404).json({message: "Member not found"})
        }

        let message = await db.message.findFirst({
            where : {
                id : messageId as string,
                channelId : channelId as string,
            },
            include : {
                member : {
                    include : {
                        User : true
                    }
                }
            }
        })

        if(!message || message.deleted){
            return res.status(404).json({message: "Message not found"})
        }

        return res.status(200).json({message: "Message deleted"})
    }
     catch (error) {
        console.log("MESSAGE EDIT PAGES API ERROR", error);
        return res.status(500).json({message: "Something went wrong"})
    }
}