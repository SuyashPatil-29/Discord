import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { useParams } from "next/navigation";

export async function PATCH(
  req: Request,
  { params: { serverId } }: { params: { serverId: string } }
) {
  try {
    const profile = await currentProfile();
    if (!profile) return new Response("Unauthorized", { status: 401 });

    const server = await db.server.update({
      where: {
        id: serverId,
        userId: {
          not: profile.id,
        },
        members: {
          some: {
            userId: profile.id,
          },
        },
      },
      data: {
        members: {
          deleteMany: {
            userId: profile.id,
          },
        },
      },
    });

    return new Response(JSON.stringify(server), { status: 200 });
  } catch (error) {
    console.log("LEAVE SERVER ROUTE ERROR");
    return new Response("Internal Error", { status: 500 });
  }
}
