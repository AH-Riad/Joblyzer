import { NextResponse } from "next/server";
import { auth } from "../../../../auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function POST(request: Request) {
  const session = await auth();
  console.log("Session in API route:", session);

  if (!session?.user || !session.user.id) {
    return NextResponse.redirect(new URL("/auth/signin", request.url));
  }

  try {
    const data = await request.json();

    const job = await prisma.job.create({
      data: {
        ...data,
        postedById: session.user.id,
      },
    });

    revalidatePath("/jobs");
    return NextResponse.json(job);
  } catch (error) {
    console.error("Error creating job:", error);
    return NextResponse.json(
      { error: "Failed to create job" },
      { status: 500 }
    );
  }
}
