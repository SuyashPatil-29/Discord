import ChatHeader from "@/components/chat/ChatHeader";
import ChatInput from "@/components/chat/ChatInput";
import ChatMessages from "@/components/chat/ChatMessages";
import { currentProfile } from "@/lib/current-profile";
import { ChannelType } from "@prisma/client";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import React from "react";
import MediaRoom from "@/components/MediaRoom";

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
    <div className="bg-white dark:bg-[#313338] flex flex-col h-screen justify-end">
      <ChatHeader
        name={channel.name}
        serverId={channel.serverId}
        type="channel"
      />
      {channel.type === ChannelType.TEXT && (
        <>
          <ChatMessages
            member={member}
            name={channel.name}
            chatId={channel.id}
            type="channel"
            apiUrl="/api/messages"
            socketUrl="/api/socket/messages"
            socketQuery={{
              channelId: channel.id,
              serverId: channel.serverId,
            }}
            paramKey="channelId"
            paramValue={channel.id}
          />
          <ChatInput
            name={channel.name}
            type="channel"
            apiUrl="/api/socket/messages"
            query={{
              channelId: channel.id,
              serverId: channel.serverId,
            }}
          />
        </>
      )}

      {channel.type === ChannelType.AUDIO && (
        <MediaRoom
        chatId={channelId}
        video={false}
        audio={true}
        />
      )}

      {channel.type === ChannelType.VIDEO && (
        <MediaRoom
        chatId={channelId}
        video={true}
        audio={true}
        />
      )}

    </div>
  );
};

export default ChannelChatPage;
