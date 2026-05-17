"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const STORAGE_KEY = "excelsior_prompt_uses";
const FREE_LIMIT = 3;

export function useGuestPromptGate() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const checkGate = (): boolean => {
    if (status === "loading" || session?.user) return true;

    const count = parseInt(localStorage.getItem(STORAGE_KEY) || "0", 10);
    if (count >= FREE_LIMIT) {
      router.push("/register");
      return false;
    }
    localStorage.setItem(STORAGE_KEY, String(count + 1));
    return true;
  };

  return { checkGate };
}
