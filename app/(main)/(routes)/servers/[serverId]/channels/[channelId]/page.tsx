import ChatHeader from "@/components/chat/ChatHeader";
import ChatInput from "@/components/chat/ChatInput";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import React from "react";

type Props = {
  params: {
    serverId: string;
    channelId: string;
  };
};

const ChannelChatPage = async ({ params: { serverId, channelId } }: Props) => {
  const profile = await currentProfile();
  if (!profile) return redirect("/");

  const channel = await db.channel.findUnique({
    where: {
      id: channelId,
    },
  });

  const member = await db.member.findFirst({
    where: {
      serverId: serverId,
      userId: profile.id,
    },
  });

  if (!channel || !member) return redirect("/");

  return (
    <div className="bg-white dark:bg-[#313338] flex flex-col h-screen">
      <ChatHeader
        name={channel.name}
        serverId={channel.serverId}
        type="channel"
      />
      <div className="flex-1">Future Messages</div>
      <ChatInput
        type="channel"
        name={channel.name}
        apiUrl="/api/socket/messages"
        query={{ channelId: channel.id, serverId: serverId }}
      />
    </div>
  );
};

export default ChannelChatPage;
