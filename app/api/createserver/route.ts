import { getAuthSession } from "@/lib/authOptions";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { serverSchema } from "@/lib/validators/validServer";
import { v4 as uuidv4 } from "uuid"
import {MemberRole} from "@prisma/client"
import { NextResponse } from "next/server";

export async function POST(req:Request) {
  try {
    const session = await getAuthSession();
    if(!session?.user) return new Response("Unauthorized", { status: 401 })

    const body = await req.json()
    const {name, image} = serverSchema.parse(body)

    const profile = await currentProfile()

    if(!profile) return new Response("Unauthorized", { status: 401 })
 
    const server = await db.server.create({
        data : {
          userId : profile.id,  
          imageUrl : image,
          name : name,
          inviteCode : uuidv4(),
          channels : {
            create : [
                {name : "general", profileId : profile.id}
            ]
          },
          members : {
            create : [
                { profileId : profile.id, role : MemberRole.ADMIN }
            ]
          }
        }
      })

    return NextResponse.json(server);
    
} catch (error) {
    console.log("CREATE SERVER ERROR", error);
    return new Response("Unexpected error occured", { status: 400 })
}
}
