"use client";

import React from "react";
import { useSocket } from "./SocketIoProvider";
import { Badge } from "./ui/badge";

type Props = {};

const SocketIndicator = (props: Props) => {
  const {isConnected} = useSocket();

  if(!isConnected) return (
    <Badge variant="outline" className=" px-2.5 py-1.5 bg-yellow-600 text-white border-none">
        Fallback : Polling every 1s
    </Badge>
  )

  if(isConnected) return (
    <Badge variant="outline" className=" px-2.5 py-1.5 bg-emerald-600 text-white border-none">
        Live: Real-time updates
    </Badge>
  )
};

export default SocketIndicator;
