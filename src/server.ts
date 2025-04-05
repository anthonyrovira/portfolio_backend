import { serve } from "@hono/node-server";
import { app } from "./index.js";

serve(app, (info) => {
  console.log(`Server running on port ${info.port}`);
});
