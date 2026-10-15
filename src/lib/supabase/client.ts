"use client";

import { createClient } from "@supabase/supabase-js";
import { useAuth } from "@clerk/nextjs";
import { useMemo } from "react";

export function useSupabase() {
  const { getToken } = useAuth();

  return useMemo(
    () =>
      createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
          async accessToken() {
            return (await getToken({ template: "supabase" })) ?? null;
          },
        }
      ),
    [getToken]
  );
}