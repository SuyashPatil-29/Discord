import Link from "next/link"
import { toast } from "./use-toast"
import { buttonVariants } from "@/components/ui/button"


export const useCustomToast = ()=>{
    const loginToast = ()=>{
        const {dismiss} = toast({
            title : "Please login",
            description :"You must be logged in to perform this action",
            variant: "destructive",
            action : (
                <Link href="/sign-in" onClick={()=>dismiss()} className={buttonVariants({variant: "outline"})}>Login</Link>
            )
        })
    }

    return {loginToast}
}