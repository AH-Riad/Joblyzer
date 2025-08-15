import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function Home() {
  const recentJobs = await prisma.job.findMany({
    take: 6,
    orderBy: { postedAt: "desc" },
    include: { postedBy: { select: { name: true } } },
  });

  return (
    <div className="space-y-12 px-4 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <section className="text-center py-12 bg-white dark:bg-gray-900 rounded-xl shadow-md border border-gray-200 dark:border-gray-800">
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-4 tracking-tight">
          Find Your Dream Job
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-6">
          Discover thousands of job opportunities with top companies and take
          the next step in your career.
        </p>
        <Link
          href="/jobs"
          className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-lg text-lg font-medium 
                     hover:bg-indigo-700 dark:hover:bg-indigo-500 transition-colors shadow-sm"
        >
          Browse Jobs
        </Link>
      </section>

      {/* Recent Jobs Carousel */}
      <section className="pb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Recent Jobs
        </h2>
        <div className="overflow-hidden relative">
          <div className="flex gap-6 animate-slide-left">
            {[...recentJobs, ...recentJobs].map((job, idx) => (
              <div
                key={job.id + idx}
                className="min-w-[280px] bg-white dark:bg-gray-900 p-6 rounded-lg shadow-sm hover:shadow-lg transition-all 
                           border border-gray-200 dark:border-gray-800 group flex flex-col justify-between"
              >
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {job.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-2">
                    {job.company}
                  </p>
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-500 mb-4 gap-4">
                    <span>{job.location}</span>
                    <span>{job.type}</span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                    {job.description}
                  </p>
                </div>
                <Link
                  href={`/jobs/${job.id}`}
                  className="mt-auto text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium"
                >
                  View Details →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
