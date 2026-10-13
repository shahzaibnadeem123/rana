
const express = require("express");
const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();

const app = express();
const PORT = 8000;

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SECRET_KEY) {
  console.error("Please add Supabase credentials to .env");
  process.exit(1);
}

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SECRET_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

app.get("/admin/users", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("users")
      .select("id, created_at, name, email, auth_id");

    if (error) {
      console.error(error.message);
      return res.status(500).json({ error: "Failed to fetch users" });
    }

    res.status(200).json(data);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
