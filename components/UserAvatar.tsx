import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { cn } from "@/lib/utils";

type Props = {
  src?: string;
  className?: string;
  name?: string;
};

const UserAvatar = ({ className, src, name }: Props) => {
  var r = Math.floor(Math.random() * 255) + 1;
  var g = Math.floor(Math.random() * 255) + 1;
  var b = Math.floor(Math.random() * 255) + 1;
  return (
    <Avatar className={cn("h-7 w-7 md:h-10 md:w-10", className)}>
      <AvatarImage src={src} />
      <AvatarFallback className="text-white">
        {name?.charAt(0).toLocaleUpperCase()}
      </AvatarFallback>
    </Avatar>
  );
};

export default UserAvatar;
