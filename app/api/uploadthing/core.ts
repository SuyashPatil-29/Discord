import { getAuthSession } from "@/lib/authOptions";
import { createUploadthing, type FileRouter } from "uploadthing/next";
 
const f = createUploadthing();

const handleAuth = async ()=>{
    const session = await getAuthSession()
    const user = session?.user

    if (!user) throw new Error("Unauthorized");
    return user
}
 
// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {

    serverImage : f({ image : {maxFileSize : "4MB", maxFileCount: 1} })
    .middleware(()=>handleAuth())
    .onUploadComplete(()=>{}),

    messageFile : f(["image", "pdf"])
    .middleware(()=>handleAuth())
    .onUploadComplete(()=>{}),

} satisfies FileRouter;
 
export type OurFileRouter = typeof ourFileRouter;