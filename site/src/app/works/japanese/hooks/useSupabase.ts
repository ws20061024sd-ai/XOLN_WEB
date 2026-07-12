"use client";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export function useSupabase() {
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    setIsConnected(!!supabase);
  }, []);

  return { supabase, isConnected };
}
