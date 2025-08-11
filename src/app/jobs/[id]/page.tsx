import ApplyButton from "@/components/ui/ApplyButton";
import { prisma } from "@/lib/prisma";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { notFound } from "next/navigation";

const JobPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const jobId = (await params).id;
  const job = await prisma.job.findUnique({
    where: {
      id: jobId,
    },
    include: { postedBy: true },
  });

  if (!job) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-10 transition-colors duration-300">
        <div className="mb-10">
          <Link
            href={"/jobs"}
            className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300 font-semibold mb-6 inline-block text-base sm:text-lg"
          >
            ← Back to Jobs
          </Link>
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-3 leading-tight">
            {job.title}
          </h1>
          <p className="text-2xl text-indigo-700 dark:text-indigo-300 font-semibold mb-6">
            {job.company}
          </p>
          <div className="flex flex-wrap items-center gap-5 text-gray-600 dark:text-gray-400 text-lg mb-8">
            <span className="inline-block px-4 py-1 rounded-full bg-indigo-100 dark:bg-indigo-800 font-medium">
              {job.location}
            </span>
            <span className="text-gray-400 dark:text-gray-600">•</span>
            <span className="inline-block px-4 py-1 rounded-full bg-gray-200 dark:bg-gray-700 font-medium">
              {job.type}
            </span>
            {job.salary && (
              <>
                <span className="text-gray-400 dark:text-gray-600">•</span>
                <span className="inline-block px-4 py-1 rounded-full bg-green-100 dark:bg-green-800 font-semibold text-green-700 dark:text-green-300">
                  {job.salary}
                </span>
              </>
            )}
          </div>
          <div className="flex items-center text-sm sm:text-base text-gray-500 dark:text-gray-400 space-x-3">
            <span>
              Posted by{" "}
              <span className="font-semibold">
                {job.postedBy?.name ?? "Unknown"}
              </span>
            </span>
            <span className="text-gray-300 dark:text-gray-600">•</span>
            <span>
              {formatDistanceToNow(new Date(job.postedAt), { addSuffix: true })}
            </span>
          </div>
        </div>
        <div className="prose max-w-none dark:prose-invert text-gray-800 dark:text-gray-300 leading-relaxed">
          <h2 className="text-2xl font-bold mb-6 dark:text-white">
            Job Description
          </h2>
          <div className="whitespace-pre-wrap">{job.description}</div>
        </div>

        <div className="mt-12 pt-10 border-t border-gray-300 dark:border-gray-700">
          <ApplyButton jobId={job.id} />
        </div>
      </div>
    </div>
  );
};

export default JobPage;
