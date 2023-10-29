import { getAuthSession } from "@/lib/authOptions";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { serverSchema } from "@/lib/validators/validServer";
import { NextResponse } from "next/server";

export async function DELETE(req:Request, {params : {serverId}}:{params : {serverId:string}}) {
  try {
    const session = await getAuthSession();
    if(!session?.user) return new Response("Unauthorized", { status: 401 })

    const server = await db.server.delete({
      where : {
        id : serverId,
        userId : session.user.id
      }
    })

    console.log(server);
    
    if(!server) return new Response("Unauthorized No Server", { status: 401 })
    return NextResponse.json(server);
  }
   catch (error) {
    console.log("DELETE SERVER ERROR", error);
    return new Response("Unexpected error occured", { status: 400 }) 
  }
}

export async function PATCH(req:Request, {params : {serverId}}:{params : {serverId:string}}) {
  try {
    const session = await getAuthSession();
    if(!session?.user) return new Response("Unauthorized", { status: 401 })

    const body = await req.json()
    const {name, image} = serverSchema.parse(body)

    const profile = await currentProfile()

    if(!profile) return new Response("Unauthorized", { status: 401 })
 
    const server = await db.server.update({
        where : {
            id : serverId,
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
