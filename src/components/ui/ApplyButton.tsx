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

  return (
    <div>
      <button>Apply</button>
    </div>
  );
}

export default ApplyButton;
