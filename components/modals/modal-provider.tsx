"use client"

import { useEffect, useState } from "react"
import CreateServerModal from "./CreateServerModal"
import InviteModal from "./InviteModal";
import EditServerModal from "./EditServerModal";
import MembersModal from "./MembersModal";
import {CreateChannelModal} from "./CreateChannel";
import LeaveServerModal from "./LeaveServerModal";
import DeleteServerModal from "./DeleteServerModal";
import DeleteChannelModal from "./DeleteChannelModal";
import { EditChannelModal } from "./EditChannelModal";
import AttctchFileModal from "./AttatchFileModal";
import DeleteMessageModal from "./DeleteMessageModal";

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
            <DeleteServerModal />
            <DeleteChannelModal />
            <EditChannelModal />
            <AttctchFileModal />
            <DeleteMessageModal />
        </>
    )
}