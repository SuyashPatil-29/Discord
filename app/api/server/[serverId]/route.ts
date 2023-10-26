import { getAuthSession } from "@/lib/authOptions";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { serverSchema } from "@/lib/validators/validServer";
import { NextResponse } from "next/server";

export async function PATCH(req:Request, {params}:{params : {serverId:string}}) {
  try {
    const session = await getAuthSession();
    if(!session?.user) return new Response("Unauthorized", { status: 401 })

    const body = await req.json()
    const {name, image} = serverSchema.parse(body)

    const profile = await currentProfile()

    if(!profile) return new Response("Unauthorized", { status: 401 })
 
    const server = await db.server.update({
        where : {
            id : params.serverId,
            userId : profile.id
        },
        data : {
            name,
            imageUrl : image
        }
      })

    return NextResponse.json(server);
    
} catch (error) {
    console.log("UPDATE SERVER ERROR", error);
    return new Response("Unexpected error occured", { status: 400 })
}
}
