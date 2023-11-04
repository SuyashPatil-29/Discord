"use client";
import { useChatQuery } from "@/hooks/use-chat-query-hook";
import { useChatSocket } from "@/hooks/use-chat-socket";
import { Member, Message, User } from "@prisma/client";
import { format } from "date-fns";
import { Loader2, ServerCrash } from "lucide-react";
import { ElementRef, Fragment, useRef } from "react";
import ChatItem from "./ChatItem";
import ChatWelcome from "./ChatWelcome";
import { useChatScroll } from "@/hooks/use-chat-scroll";

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
  const addKey = `chat:${chatId}:messages`;
  const updateKey = `chat:${chatId}:messages:update`;

  const chatRef = useRef<ElementRef<"div">>(null);
  const bottomRef = useRef<ElementRef<"div">>(null);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useChatQuery({
      apiUrl,
      paramKey,
      paramValue,
      queryKey,
    });

  useChatSocket({ queryKey, addKey, updateKey });
  useChatScroll({
    bottomRef,
    chatRef,
    count : data?.pages?.[0]?.items?.length ?? 0, 
    loadMore: fetchNextPage,
    shouldLoadMore: !isFetchingNextPage
  })

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
    <div className="flex-1 flex flex-col py-4 overflow-y-auto" ref={chatRef}>
      {!hasNextPage && <div className="flex-1" />}
      {!hasNextPage && (<ChatWelcome type={type} name={name} />)}
      {hasNextPage && (
        <div className="flex justify-center">
          {isFetchingNextPage ? (
            <Loader2 className="h-6 w-6 text-zinc-500 animate-spin my-4" />
          ) : (
            <button className="text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 text-xs my-4 dark:hover:text-zinc-300 transition"
            onClick={()=> fetchNextPage()}
            >
              Load previous messages
            </button>
          )}
        </div>
      )}
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
      <div ref={bottomRef} />
    </div>
  );
};

export default ChatMessages;
