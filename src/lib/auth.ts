import { signIn, signOut } from "next-auth/react";
import { redirect } from "next/navigation";

// Login function: accepts a provider string ("github" or "google")
export const login = async (provider: "github" | "google") => {
  await signIn(provider, { callbackUrl: "/" });
};

// Logout function
export const logout = async () => {
  await signOut({ callbackUrl: "/auth/signin" });
};
