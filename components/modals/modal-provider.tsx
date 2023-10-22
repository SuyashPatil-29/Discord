"use client"

import { useEffect, useState } from "react"
import CreateServerModal from "./CreateServerModal"

export const ModalProvider = () =>{
    const [isMounted, setIsMounted] = useState<boolean>(false);

    useEffect(()=>{
        setIsMounted(true);
    },[])
    
    if(!isMounted) return null;

    return(
        <>
            <CreateServerModal />
        </>
    )
}