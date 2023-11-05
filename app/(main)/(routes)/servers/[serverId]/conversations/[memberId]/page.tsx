import MediaRoom from "@/components/MediaRoom";
import ChatHeader from "@/components/chat/ChatHeader";
import ChatInput from "@/components/chat/ChatInput";
import ChatMessages from "@/components/chat/ChatMessages";
import { getOrCreateConversation } from "@/lib/conversation";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import React from "react";

type Props = {
  params: {
    memberId: string;
    serverId: string;
  };
  searchParams: {
    video?: boolean;
  };
};

const MemberConversationsPage = async ({
  params: { memberId, serverId },
  searchParams: { video },
}: Props) => {
  const profile = await currentProfile();

  if (!profile) return redirect("/");

  const currentMember = await db.member.findFirst({
    where: {
      serverId: serverId,
      userId: profile.id,
    },
    include: {
      User: true,
    },
  });

  if (!currentMember) return redirect("/");

  const conversation = await getOrCreateConversation(
    currentMember.id,
    memberId
  );

  if (!conversation) return redirect(`/servers/${serverId}`);

  const { memberOne, memberTwo } = conversation;

  const otherMember = memberOne.userId === profile.id ? memberTwo : memberOne;

  return (
    <div className="bg-white dark:bg-[#313338] flex flex-col h-screen">
      <ChatHeader
        type="conversation"
        serverId={serverId}
        name={otherMember.User.name!}
        imageUrl={otherMember.User.image!}
      />
      {!video && (
        <>
          <ChatMessages
            member={currentMember}
            name={otherMember.User.name!}
            chatId={conversation.id}
            type="conversation"
            apiUrl="/api/direct-messages"
            paramKey="conversationId"
            paramValue={conversation.id}
            socketUrl="/api/socket/direct-messages"
            socketQuery={{
              conversationId: conversation.id,
            }}
          />
          <ChatInput
            name={otherMember.User.name!}
            type="conversation"
            apiUrl="/api/socket/direct-messages"
            query={{
              conversationId: conversation.id,
            }}
          />
        </>
      )}

      {video && (
        <MediaRoom
        chatId={conversation.id}
        video={true}
        audio={true}
        />
      )}
    </div>
  );
};

export default MemberConversationsPage;
