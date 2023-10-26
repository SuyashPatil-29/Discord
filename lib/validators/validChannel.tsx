import { z } from "zod";
import {ChannelType} from "@prisma/client"

export const ChannelSchema = z.object({
    name: z.string().min(3),
    type : z.nativeEnum(ChannelType),
    serverId : z.string()
})

export type channelRequest = z.infer<typeof ChannelSchema>