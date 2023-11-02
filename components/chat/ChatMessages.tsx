"use client";
import React, { Fragment } from "react";
import { Member, Message, User } from "@prisma/client";
import ChatWelcome from "./ChatWelcome";
import { useChatQuery } from "@/hooks/use-chat-query-hook";
import { Loader2, ServerCrash } from "lucide-react";
import ChatItem from "./ChatItem";
import { format } from "date-fns";

const DATE_FORMAT = "d MMM yyy, HH:mm";

type Props = {
  name: string;
  member: Member;
  chatId: string;
  apiUrl: string;
  socketUrl: string;
  socketQuery: Record<string, string>;
  paramKey: "channelId" | "conversationId";
  paramValue: string;
  type: "channel" | "conversation";
};

type MessageWithMemberWithProfile = Message & {
  member: Member & {
    User: User;
  };
};

const ChatMessages = ({
  apiUrl,
  chatId,
  name,
  member,
  paramKey,
  paramValue,
  socketQuery,
  socketUrl,
  type,
}: Props) => {
  const queryKey = `chat:${chatId}`;

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useChatQuery({
      apiUrl,
      paramKey,
      paramValue,
      queryKey,
    });

  if (status === "pending") {
    return (
      <div className="flex flex-col flex-1 justify-center items-center">
        <Loader2 className=" text-zinc-500 h-7 w-7 animate-spin my-4" />
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Loading messages...
        </p>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="flex flex-col flex-1 justify-center items-center">
        <ServerCrash className=" text-zinc-500 h-7 w-7 my-4" />
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Something went wrong
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col py-4 overflow-y-auto">
      <div className="flex-1" />
      <ChatWelcome type={type} name={name} />
      <div className="flex flex-col-reverse mt-auto">
        {data?.pages.map((group, i) => (
          <Fragment key={i}>
            {group.items.map((message: MessageWithMemberWithProfile) => {
              return (
                <ChatItem
                  key={message.id}
                  content={message.content}
                  currentMember={member}
                  deleted={message.deleted}
                  fileUrl={message.fileUrl}
                  id={message.id}
                  isUpdated={message.updatedAt !== message.createdAt}
                  member={message.member}
                  socketUrl={socketUrl}
                  socketQuery={socketQuery}
                  timeStamp={format(new Date(message.createdAt), DATE_FORMAT)}
                />
              );
            })}
          </Fragment>
        ))}
      </div>
    </div>
  );
};

export default ChatMessages;
