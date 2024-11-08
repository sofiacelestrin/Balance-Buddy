import { createClient } from "@supabase/supabase-js";
const supabaseUrl = "https://zhxpkllnffnfgmewqrda.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpoeHBrbGxuZmZuZmdtZXdxcmRhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjkyMzc2ODQsImV4cCI6MjA0NDgxMzY4NH0.MNKVY3HA1NXfvyRH4C8gA-XAiecfo5d_xwBp7HPNNHw";

import { Database } from "./supabaseTypes";

export const supabase = createClient<Database>(
  supabaseUrl as string,
  supabaseKey as string,
);
