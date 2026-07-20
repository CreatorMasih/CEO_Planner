import { createClient } from "@supabase/supabase-js";
import { readFileSync, existsSync } from "fs";
import ws from "ws";

globalThis.WebSocket = ws;

let supabaseUrl = process.env.SUPABASE_URL;
let supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (existsSync(".env")) {
  for (const line of readFileSync(".env", "utf8").split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) continue;
    const index = trimmed.indexOf("=");
    const key = trimmed.slice(0, index);
    const value = trimmed.slice(index + 1).replace(/^["']|["']$/g, "");
    if (key === "SUPABASE_URL") supabaseUrl = value;
    if (key === "SUPABASE_SERVICE_ROLE_KEY") supabaseKey = value;
  }
}

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

for (const table of ["profiles", "departments", "user_roles", "planner_settings", "tasks"]) {
  const { data: rows, error: err } = await supabase.from(table).select("*").limit(1);
  if (err) {
    console.error(`Error querying ${table}:`, err.message);
  } else {
    console.log(`${table} keys:`, Object.keys(rows[0] || {}));
  }
}
