import { getAuthSession } from "@/lib/authOptions";
import { db } from "@/lib/db";
import { v4 as uuidv4 } from "uuid";

export async function PATCH(
  req: Request,
  { params: { serverId } }: { params: { serverId: string } }
) {
  try {
    const session = await getAuthSession();
    if (!session?.user) return new Response(null, { status: 401 });

    if(!serverId) return new Response("Invalid server id", { status: 400 })

    const server = await db.server.update({
      where: {
        id: serverId,
        userId: session.user.id,
      },
      data: {
        inviteCode: uuidv4(),
      },
    });

    return new Response(JSON.stringify(server));
  } catch (error) {
    console.log("Generate Link route error", error);
    return new Response("Unexpected error occured", { status: 400 });
  }
}
