import postgres from "postgres";
import fs from "fs";
import path from "path";

// Simple .env parser
const envPath = path.resolve(process.cwd(), ".env");
if (fs.existsSync(envPath)) {
  const lines = fs.readFileSync(envPath, "utf-8").split("\n");
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith("#") && trimmed.includes("=")) {
      const idx = trimmed.indexOf("=");
      const key = trimmed.slice(0, idx).trim();
      let val = trimmed.slice(idx + 1).trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      process.env[key] = val;
    }
  }
}

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error("No DATABASE_URL found in .env");
  process.exit(1);
}

const sql = postgres(connectionString);

async function applyFixes() {
  console.log("Applying RLS and Foreign Key Index fixes to Supabase...");

  // 1. Enable Row Level Security (RLS) on all public tables
  const tables = [
    "venues",
    "subscriptions",
    "service_visits",
    "inquiries",
    "operator_users",
  ];

  for (const table of tables) {
    console.log(`Enabling RLS on public.${table}...`);
    await sql.unsafe(`ALTER TABLE public.${table} ENABLE ROW LEVEL SECURITY;`);
  }

  // 2. Create Foreign Key Indexes
  console.log("Creating unindexed foreign key indexes...");

  await sql.unsafe(`
    CREATE INDEX IF NOT EXISTS subscriptions_venue_id_idx ON public.subscriptions(venue_id);
  `);

  await sql.unsafe(`
    CREATE INDEX IF NOT EXISTS service_visits_venue_id_idx ON public.service_visits(venue_id);
  `);

  await sql.unsafe(`
    CREATE INDEX IF NOT EXISTS service_visits_subscription_id_idx ON public.service_visits(subscription_id);
  `);

  await sql.unsafe(`
    CREATE INDEX IF NOT EXISTS inquiries_venue_id_idx ON public.inquiries(venue_id);
  `);

  console.log("✅ Successfully enabled RLS on all tables and created all foreign key indexes!");
  await sql.end();
}

applyFixes().catch((err) => {
  console.error("Error applying fixes:", err);
  process.exit(1);
});
