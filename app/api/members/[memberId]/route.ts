import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";

export async function PATCH(req:Request, {params:{memberId}}:{params:{memberId : string}}){
    try {
        const profile = await currentProfile()
        const { searchParams } = new URL(req.url)
        if(!profile) return new Response("Unauthorized", {status: 401})

        const {role} = await req.json()
        const serverId = searchParams.get("serverId")

        if(!serverId) return new Response("Bad Request", {status : 400})
        
        const server = await db.server.update({
            where : {
                id : serverId,
                userId : profile.id
            },
            data : {
                members : {
                    update : {
                        where : {
                            id : memberId,
                            userId : {
                                not : profile.id
                            }
                        },
                        data : {
                            role
                        }
                    }
                }
            },
            include : {
                members : {
                    include :{
                        User : true
                    },
                    orderBy : {
                        role : "asc"
                    }
                }
            }
        })

        if(!server) return new Response("Not Found", {status: 404})

        return new Response(JSON.stringify(server), {status : 200})
    }
     catch (error) {
        console.log("CHANGE ROLE ROUTE ERROr", error);
        return new Response("Internal Error", {status : 500})
    }
}

export async function DELETE(req:Request, {params:{memberId}}:{params:{memberId :string}}) {
    try {
        const profile = await currentProfile()
        if(!profile) return new Response("Unauthorized", {status: 401})

        const {searchParams} = new URL(req.url)
        const serverId = searchParams.get("serverId")

        if(!serverId) return new Response("Bad Request", {status : 400})
        if(!memberId) return new Response("Bad Request", {status : 400})

        const server = await db.server.update({
            where : {
                id : serverId,
                userId : profile.id
            },
            data : {
                members : {
                    deleteMany : {
                        id : memberId,
                        userId : {
                            not : profile.id
                        }
                    }
                }
            },
            include: {
                members : {
                    include : {
                        User : true
                    },
                    orderBy : {
                        role : "asc"
                    }
                }
            }
        })

        return new Response(JSON.stringify(server), {status : 200})
    }
     catch (error) {
        console.log("CHANGE ROLE ROUTE ERROr", error);
        return new Response("Internal Error", {status : 500})
    }
}