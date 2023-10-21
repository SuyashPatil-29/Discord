import { getAuthSession } from "./authOptions"
import {redirect} from "next/navigation"
import { db } from "./db"

export const initialProfile = async () =>{
    const session = await getAuthSession()
    const user = session?.user

    if(!user){
        redirect("/sign-in")
    }

    const profile = await db.user.findFirst({
        where : {
            id : user.id
        }
    })

    if(profile){
        return profile 
    }

    const newProfile = await db.user.create({
        data : {
            id : user.id,
            name : user.name,
            image : user.image,
            email : user.email
        }
    })

    return newProfile
}
