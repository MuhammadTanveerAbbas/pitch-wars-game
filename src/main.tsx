import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

const REQUIRED_ENV = ["VITE_SUPABASE_URL", "VITE_SUPABASE_PUBLISHABLE_KEY"] as const;
const missing = REQUIRED_ENV.filter((k) => !import.meta.env[k]);
if (missing.length > 0) {
  document.body.innerHTML = `<pre style="padding:2rem;font-family:monospace;color:red">Missing required environment variables:\n${missing.join("\n")}\n\nCheck your .env.local file.</pre>`;
  throw new Error(`Missing env vars: ${missing.join(", ")}`);
}

createRoot(document.getElementById("root")!).render(<App />);
