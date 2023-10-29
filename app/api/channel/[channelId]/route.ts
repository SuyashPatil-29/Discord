import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { editChannelSchema } from "@/lib/validators/validEditChannel";

export async function DELETE(
  req: Request,
  { params: { channelId } }: { params: { channelId: string } }
) {
  try {
    const profile = await currentProfile();
    if (!profile) return new Response("Unauthorized", { status: 401 });

    if (!channelId) return new Response("Bad Request", { status: 400 });

    await db.channel.delete({
      where: {
        id: channelId,
        userId: profile.id,
      },
    });

    return new Response("OK", { status: 200 });
  } catch (error) {
    console.log("CHANNEL DELETION ROUTE ERROR", error);
    return new Response("Unexpected error occured", { status: 400 });
  }
}

export async function PATCH(req: Request) {
  try {
    const profile = await currentProfile();
    if (!profile) return new Response("Unauthorized", { status: 401 });

    const body = await req.json();
    const {
      values: { name, type },
      serverId,
      channelId,
    } = editChannelSchema.parse(body);

    if (!serverId || !channelId || !name || !type)
      return new Response("Bad Request", { status: 400 });

    if (name === "general") {
      return new Response("Name cannot be 'general'", { status: 400 });
    }

    await db.channel.update({
      where: {
        userId: profile.id,
        id: channelId,
        serverId: serverId,
      },
      data: {
        name,
        type,
      },
    });

    return new Response("OK", { status: 200 });
  } catch (error) {
    console.log("CHANNEL EDIT ERROR", error);
    return new Response("Unexpected error occured", { status: 400 });
  }
}
