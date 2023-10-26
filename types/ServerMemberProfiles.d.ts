import { Server,Member,User } from "@prisma/client";


export type ServerMemberProfile = Server & {
  members: (Member & { User: User })[];
};

