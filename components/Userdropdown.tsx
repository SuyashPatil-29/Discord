"use client";

import { LogOut, Settings, SkullIcon } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { redirect } from "next/navigation";
import { Skeleton } from "./ui/skeleton";

export function UserDropdown() {
  const { data: session } = useSession();

  const handleLogout = () => {
    signOut()
    redirect("/")
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="cursor-pointer">
        <Avatar className="!h-12 !w-12">
          <AvatarImage src={session?.user.image || ""} />
          <AvatarFallback>
            {session?.user.name?.[0] || <Skeleton className="h-12 w-12 rounded-full" />}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 mx-4">
        <DropdownMenuLabel>
          <p className="text-sm font-medium">{session?.user.name}</p>
          <p className="text-xs font-medium text-muted-foreground">
            {session?.user.email}
          </p>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            <span>Sign Out</span>
          </DropdownMenuItem>
          <Link href="/settings">
          </Link>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}