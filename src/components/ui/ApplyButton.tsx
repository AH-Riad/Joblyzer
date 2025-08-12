"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

function ApplyButton({ jobId }: { jobId: string }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [applicationStatus, setApplicatiionStatus] = useState<
    "idle" | "success" | "error"
  >("idle");

  const handleApply = async () => {
    if (!session) {
      router.push("/auth/signin");
      return;
    }

    setErrorMessage("");
    try {
      const response = await fetch(`/api/${jobId}`, {
        method: "POST",
      });
      setApplicatiionStatus("success");
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("Failed to apply for this job");
      }
      setApplicatiionStatus("error");
    }
  };
  if (status === "loading") {
    return <button disabled>Loading...</button>;
  }

  return (
    <div>
      <button onClick={handleApply}>Apply</button>
    </div>
  );
}

export default ApplyButton;
