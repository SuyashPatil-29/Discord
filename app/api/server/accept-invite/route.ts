import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";

export async function PATCH(
  req: Request,
  { params }: { params: { inviteCode: string } }
) {
  try {
    const profile = await currentProfile();
    if (!profile) return new Response("Unauthorized", { status: 401 });

    const body = await req.json();
    
    await db.server.update({
      where: {
        inviteCode: body.inviteCode,
      },
      data: {
        members: {
          create: [
            {
              userId: profile.id,
            },
          ],
        },
      },
    });

    return new Response("OK", { status: 201 });
  } catch (error) {
    console.log("Join Server route error", error);
    return new Response("Unexpected error occured", { status: 400 });
  }
}
