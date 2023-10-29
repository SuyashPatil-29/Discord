import { z } from "zod";
import { ChannelType } from "@prisma/client";

export const editChannelSchema = z.object({
  values: z.object({
    name: z.string().min(1).max(30),
    type: z.enum([ChannelType.TEXT, ChannelType.AUDIO, ChannelType.VIDEO]),
  }),
  serverId: z.string().min(1),
  channelId: z.string().min(1),
});

export type editChannelRequest = z.infer<typeof editChannelSchema>;