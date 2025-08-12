import { NextRequest, NextResponse } from "next/server";
import { auth } from "../../../../auth";
import { URL } from "next/dist/compiled/@edge-runtime/primitives/url";
import { prisma } from "@/lib/prisma";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ jobId: string }> }
) {
  const session = await auth();

  if (!session || !session.user.id) {
    return NextResponse.redirect(new URL("/auth/signin", request.nextUrl));
  }

  try {
    const { jobId } = await params;
    const Searchedjob = await prisma.job.findUnique({ where: { id: jobId } });

    if (!Searchedjob) {
      return new NextResponse("Job not found", { status: 404 });
    }

    const existingApplication = await prisma.applications.findFirst({
      where: {
        jobId: jobId,
        userId: session.user.id,
      },
    });

    if (existingApplication) {
      return new NextResponse("You already have applied for this job", {
        status: 400,
      });
    }

    const application = await prisma.applications.create({
      data: {
        jobId: jobId,
        userId: session.user.id,
        status: "PENDING",
      },
    });
    return NextResponse.json(application);
  } catch (error) {
    console.log("Error applying job", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
