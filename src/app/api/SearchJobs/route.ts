import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const query = searchParams.get("q") || "";
  const searchType = searchParams.get("type") || "";
  const searchLocation = searchParams.get("location") || "";

  const jobs = await prisma.job.findMany({
    where: {
      AND: [
        query
          ? {
              OR: [
                { title: { contains: query, mode: "insensitive" } },
                { company: { contains: query, mode: "insensitive" } },
                { description: { contains: query, mode: "insensitive" } },
              ],
            }
          : {},
        searchType ? { type: searchType } : {},
        searchLocation
          ? { location: { contains: searchLocation, mode: "insensitive" } }
          : {},
      ],
    },
    orderBy: { postedAt: "desc" },
    include: { postedBy: true },
  });
  revalidatePath("/jobs");

  return NextResponse.json(jobs);
}
