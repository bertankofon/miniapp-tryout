"use client";

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://qhjcnffvandmnytwmmwi.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFoamNuZmZ2YW5kbW55dHdtbXdpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUzNjk2ODYsImV4cCI6MjA4MDk0NTY4Nn0.OSUUhNnCaVsrwNFQncie0ZjBHTP3GVctz6SfvRB7C4E";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

