import { Server } from "@prisma/client";

export type ServerMemberProfile = Server & {
  members: (Member & { profile: Profile })[];
};
