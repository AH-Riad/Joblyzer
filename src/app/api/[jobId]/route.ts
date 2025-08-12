import { NextRequest, NextResponse } from "next/server";
import { auth } from "../../../../auth";
import { prisma } from "@/lib/prisma";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ jobId: string }> }
) {
  const session = await auth();

  if (!session || !session.user?.id) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const { jobId } = await params;

    // Verify job exists
    const searchedJob = await prisma.job.findUnique({ where: { id: jobId } });
    if (!searchedJob) {
      return new NextResponse("Job not found", { status: 404 });
    }

    // Prevent duplicate applications
    const existingApplication = await prisma.applications.findFirst({
      where: {
        jobId: jobId,
        userId: session.user.id,
      },
    });

    if (existingApplication) {
      return new NextResponse("You already applied for this job", {
        status: 400,
      });
    }

    // Create new application
    const application = await prisma.applications.create({
      data: {
        jobId: jobId,
        userId: session.user.id,
        status: "PENDING",
      },
    });

    return NextResponse.json(application, { status: 201 });
  } catch (error) {
    console.error("Error applying job", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
