"use client"

import { useEffect, useState } from "react"
import CreateServerModal from "./CreateServerModal"
import InviteModal from "./InviteModal";
import EditServerModal from "./EditServerModal";
import MembersModal from "./MembersModal";
import {CreateChannelModal} from "./CreateChannel";
import LeaveServerModal from "./LeaveServerModal";

export const ModalProvider = () =>{
    const [isMounted, setIsMounted] = useState<boolean>(false);

    useEffect(()=>{
        setIsMounted(true);
    },[])

    if(!isMounted) return null;

    return(
        <>
            <CreateServerModal />
            <InviteModal />
            <EditServerModal />
            <MembersModal />
            <CreateChannelModal />
            <LeaveServerModal />
        </>
    )
}