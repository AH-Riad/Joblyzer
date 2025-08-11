import Link from "next/link";
import { prisma } from "@/lib/prisma";
type Job = {
  id: string;
  title: string;
  company: string;
  description: string;
  type: string;
  location: string;
  salary?: string;
  postedBy?: {
    name?: string;
  };
};

export default async function JobPage({
  searchParams,
}: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { q, type, location } = (await searchParams) || {};
  const query = q as string | undefined;
  const searchType = type as string | undefined;
  const searchLocation = location as string | undefined;

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

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300 px-4 sm:px-10 py-8">
      <div className="max-w-5xl mx-auto space-y-12">
        {/* Search Section */}
        <section className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-md dark:shadow-lg border border-gray-200 dark:border-gray-700 transition-shadow duration-300">
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-gray-100 mb-8 text-center">
            Find Your Next Job
          </h1>
          <form className="grid grid-cols-1 md:grid-cols-4 gap-5">
            <input
              type="text"
              name="q"
              placeholder="Search jobs..."
              className="px-5 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              spellCheck={false}
            />
            <select
              name="type"
              className="px-5 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              defaultValue=""
            >
              <option value="">All Types</option>
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Contract">Contract</option>
              <option value="Internship">Internship</option>
            </select>
            <input
              type="text"
              name="location"
              placeholder="Location"
              className="px-5 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              spellCheck={false}
            />
            <button
              type="submit"
              className="bg-indigo-600 dark:bg-indigo-700 hover:bg-indigo-700 dark:hover:bg-indigo-800 text-white font-semibold rounded-lg px-6 py-3 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Search
            </button>
          </form>
        </section>
        {/* Jobs Listing Section */}
        <section>
          {jobs.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {jobs.map((job) => (
                <div
                  key={job.id}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-md dark:shadow-lg border border-gray-200 dark:border-gray-700 transition-shadow duration-300 p-6 flex flex-col justify-between"
                >
                  <div>
                    <h2 className="text-2xl font-bold text-indigo-700 dark:text-indigo-400 mb-2 line-clamp-2">
                      {job.title}
                    </h2>
                    <p className="text-gray-800 dark:text-gray-300 font-semibold mb-1">
                      {job.company}
                    </p>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-4">
                      <span>{job.location}</span>
                      <span>{job.type}</span>
                      {job.salary && (
                        <span className="font-semibold text-indigo-600 dark:text-indigo-500">
                          {job.salary}
                        </span>
                      )}
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 line-clamp-3">
                      {job.description}
                    </p>
                  </div>
                  <div className="mt-6 flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Posted by {job.postedBy?.name || "Unknown"}
                    </span>
                    <Link
                      href={`/jobs/${job.id}`}
                      className="text-indigo-600 dark:text-indigo-400 hover:underline font-semibold"
                    >
                      View Details →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-600 dark:text-gray-400 text-lg mt-20">
              No jobs found. Try different filters.
            </p>
          )}
        </section>
      </div>
    </div>
  );
}
