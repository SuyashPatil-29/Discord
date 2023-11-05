"use client";

import { useEffect, useState } from "react";
import { LiveKitRoom, VideoConference } from "@livekit/components-react";
import "@livekit/components-styles";
import { useSession } from "next-auth/react";
import { Loader2 } from "lucide-react";

type Props = {
  chatId: string;
  video: boolean;
  audio: boolean;
};

const MediaRoom = ({ audio, chatId, video }: Props) => {
  const { data: user } = useSession();
  const [token, setToken] = useState("");

  useEffect(() => {
    const name = user?.user.name as string;

    (async () => {
      try {
        const res = await fetch(`/api/livekit?room=${chatId}&username=${name}`);
        const data = await res.json();
        setToken(data.token);
      } catch (e) {
        console.error(e);
      }
    })();
  }, [chatId, user?.user.name]);

  if (token === "") {
    return (
      <div className="flex flex-col flex-1 justify-center items-center">
        <Loader2 className="h-7 w-7 animate-spin text-zinc-500 my-4" />
        <p className="text-xs text-zinc-500 dark:text-zinc-400">Loading...</p>
      </div>
    );
  }

  return (
    <LiveKitRoom
    data-lk-theme="default"
    serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
    token={token}
    connect={true}
    video={video}
    audio={audio}
    >
      <VideoConference />
    </LiveKitRoom>
  );
};

export default MediaRoom;
