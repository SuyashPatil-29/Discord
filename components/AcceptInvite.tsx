"use client";
import React, { useState } from "react";
import { Button } from "./ui/button";
import { Server, Member } from "@prisma/client";
import Image from "next/image";
import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import { redirect } from "next/navigation";

type Props = {
  server: Server & { members: Member[] };
};

const AcceptInvite = ({ server }: Props) => {

    const [success, setSussess] = useState(false)

    const {mutate : handleInvite} = useMutation({
      mutationFn: async () => {
        const payload = {
            inviteCode : server.inviteCode
        }
        const { data } = await axios.patch("/api/server/accept-invite", payload);
        return data;
      },
      onSuccess : () => {
        setSussess(true)
      },
      onError : (err) => {
        console.log(err);
      }
    });

    if(success) return redirect(`/servers/${server.id}`)

  const serverMembers = server.members.length;
  return (
    <div className="bg-white h-fit w-[400px] flex flex-col gap-5 px-6 py-10 items-center rounded-lg shadow-2xl justify-between">
      <Image src={server.imageUrl} height={100} width={100} alt="Server-Logp" />
      <h1 className="text-2xl text-black font-bold">{server.name}</h1>
      <p className="text-zinc-700 text-lg">
        {serverMembers} {serverMembers === 1 ? "Member" : "Members"}
      </p>
      <Button
        className="w-full bg-[rgb(88,101,242)] text-white hover:bg-opacity-80"
        variant="primary"
        onClick={()=>handleInvite()}
      >
        Accept Invite
      </Button>
    </div>
  );
};

export default AcceptInvite;
