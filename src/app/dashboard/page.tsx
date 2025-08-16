import { prisma } from "@/lib/prisma";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "../../../auth";

// import types from Prisma
import type { Job, Applications, User } from "@prisma/client";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/auth/signin");
  }

  //  Correctly typed
  const [applications, postedJobs] = await Promise.all([
    prisma.applications.findMany({
      where: { userId: session.user.id },
      include: { job: { include: { postedBy: true } } },
      orderBy: { appliedAt: "desc" },
    }) as Promise<(Applications & { job: Job & { postedBy: User } })[]>,

    prisma.job.findMany({
      where: { postedById: session.user.id },
      include: { _count: { select: { applications: true } } },
      orderBy: { postedAt: "desc" },
    }) as Promise<(Job & { _count: { applications: number } })[]>,
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-10">
        Dashboard
      </h1>

      <div className="grid gap-10 md:grid-cols-2">
        {/* Posted Jobs */}
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Posted Jobs
            </h2>
            <Link
              href="/jobs/post"
              className="px-4 py-2 text-sm font-medium rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors duration-200"
            >
              Post New Job
            </Link>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md divide-y divide-gray-200 dark:divide-gray-700">
            {postedJobs.length === 0 ? (
              <p className="p-6 text-gray-500 dark:text-gray-400 text-center">
                You haven't posted any jobs yet.
              </p>
            ) : (
              postedJobs.map((job) => (
                <div
                  key={job.id}
                  className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">
                        {job.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 mb-2">
                        {job.company}
                      </p>
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 flex-wrap gap-1">
                        <span>{job.location}</span>
                        <span>•</span>
                        <span>{job.type}</span>
                        <span>•</span>
                        <span>
                          {formatDistanceToNow(new Date(job.postedAt), {
                            addSuffix: true,
                          })}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200">
                        {job._count.applications} applications
                      </span>
                    </div>
                  </div>
                  <div className="mt-4 flex justify-end">
                    <Link
                      href={`/jobs/${job.id}`}
                      className="text-indigo-600 dark:text-indigo-400 hover:underline text-sm font-medium"
                    >
                      View Job
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Applications */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6">
            Your Applications
          </h2>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md divide-y divide-gray-200 dark:divide-gray-700">
            {applications.length === 0 ? (
              <p className="p-6 text-gray-500 dark:text-gray-400 text-center">
                You haven't applied to any jobs yet.
              </p>
            ) : (
              applications.map((application) => (
                <div
                  key={application.id}
                  className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">
                        {application.job.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 mb-2">
                        {application.job.company}
                      </p>
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 flex-wrap gap-1">
                        <span>{application.job.location}</span>
                        <span>•</span>
                        <span>{application.job.type}</span>
                        <span>•</span>
                        <span>
                          Applied{" "}
                          {formatDistanceToNow(
                            new Date(application.appliedAt),
                            { addSuffix: true }
                          )}
                        </span>
                      </div>
                    </div>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                        ${
                          application.status === "PENDING"
                            ? "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200"
                            : application.status === "ACCEPTED"
                            ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
                            : "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200"
                        }`}
                    >
                      {application.status}
                    </span>
                  </div>
                  <div className="mt-4 flex justify-end">
                    <Link
                      href={`/jobs/${application.job.id}`}
                      className="text-indigo-600 dark:text-indigo-400 hover:underline text-sm font-medium"
                    >
                      View Job
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
