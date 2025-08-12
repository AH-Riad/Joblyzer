"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

function ApplyButton({ jobId }: { jobId: string }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [errorMessage, setErrorMessage] = useState<string>("");
  const [applicationStatus, setApplicationStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [loading, setLoading] = useState(false);

  const handleApply = async () => {
    if (!session) {
      router.push("/auth/signin");
      return;
    }

    setErrorMessage("");
    setLoading(true);

    try {
      const response = await fetch(`/api/${jobId}`, {
        method: "POST",
      });

      if (response.status === 401) {
        router.push("/auth/signin");
        return;
      }

      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || "Failed to apply for job");
      }

      setApplicationStatus("success");
    } catch (error) {
      setApplicationStatus("error");
      setErrorMessage(
        error instanceof Error ? error.message : "Unexpected error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex flex-col items-center">
      <button
        onClick={handleApply}
        disabled={
          status === "loading" || loading || applicationStatus === "success"
        }
        aria-pressed={applicationStatus === "success"}
        className={`
          w-full px-6 py-3 rounded-2xl font-semibold transition-transform duration-200
          ${
            applicationStatus === "success"
              ? "bg-emerald-600 hover:bg-emerald-700"
              : "bg-indigo-600 hover:bg-indigo-700"
          }
          text-white disabled:opacity-50 disabled:cursor-not-allowed
          shadow-md hover:shadow-xl transform hover:-translate-y-0.5
          dark:shadow-[0_8px_30px_rgba(99,102,241,0.12)] dark:hover:shadow-[0_12px_40px_rgba(99,102,241,0.18)]
          focus:outline-none focus:ring-4 focus:ring-indigo-300/40 dark:focus:ring-indigo-400/30
        `}
      >
        {status === "loading" || loading
          ? "Applying..."
          : applicationStatus === "success"
          ? "Applied"
          : "Apply"}
      </button>

      {applicationStatus === "success" && (
        <p className="mt-3 text-sm text-emerald-500 dark:text-emerald-400 font-medium">
          Application submitted — good luck!
        </p>
      )}
      {applicationStatus === "error" && (
        <p className="mt-3 text-sm text-red-500 dark:text-red-400 text-center">
          {errorMessage}
        </p>
      )}
    </div>
  );
}

export default ApplyButton;
