import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { useQuery } from "@tanstack/react-query";
import { motion } from "motion/react";
import { ArrowRight, Database, Layers, Palette, ShieldCheck, Workflow, Zap } from "lucide-react";
import { Link } from "react-router";
import { AnimatedPage } from "@/components/ui/AnimatedPage";
import { api } from "@/lib/api";
import { fadeIn, staggerContainer } from "@/utils/motion";

const highlights = [
  {
    icon: Layers,
    title: "Modular MVC API",
    text: "Express 5 modules (model · controller · routes · validation) auto-mounted from src/modules.",
  },
  {
    icon: Database,
    title: "Neon PostgreSQL",
    text: "Serverless Postgres with safe tagged-template queries and idempotent migrations.",
  },
  {
    icon: ShieldCheck,
    title: "Secure by default",
    text: "Helmet, CORS, Arcjet shield / bot detection / rate limiting and Zod validation.",
  },
  {
    icon: Zap,
    title: "React 19 + Vite",
    text: "Lazy, code-split routes registered automatically from src/features.",
  },
  {
    icon: Workflow,
    title: "Zustand + TanStack Query",
    text: "Tiny client state stores and cached, auto-refetching server state.",
  },
  {
    icon: Palette,
    title: "MUI + Tailwind v4",
    text: "MUI components, Tailwind utilities, shared light / dark mode via CSS layers.",
  },
];

function ApiStatus() {
  const { data, isPending, isError } = useQuery({
    queryKey: ["health"],
    queryFn: () => api.get("/health"),
    refetchInterval: 30_000,
  });

  if (isPending) return <Chip label="Checking API…" size="small" />;
  if (isError) return <Chip label="API offline" color="error" size="small" />;

  return (
    <div className="flex flex-wrap justify-center gap-2">
      <Chip label="API online" color="success" size="small" />
      <Chip
        label={`Database ${data.database}`}
        color={data.database === "connected" ? "success" : "warning"}
        size="small"
      />
      <Chip
        label={`Modules: ${data.modules.join(", ") || "none"}`}
        size="small"
        variant="outlined"
      />
    </div>
  );
}

export default function HomePage() {
  return (
    <AnimatedPage>
      <section className="mx-auto flex max-w-3xl flex-col items-center gap-6 py-12 text-center">
        <ApiStatus />
        <Typography variant="h3" component="h1" className="font-bold tracking-tight">
          Ship full-stack apps{" "}
          <span className="bg-gradient-to-r from-brand-600 to-pink-500 bg-clip-text text-transparent">
            faster
          </span>
        </Typography>
        <Typography color="text.secondary" className="text-lg">
          A modern, modular MVC boilerplate. Add a new feature to both the API and the UI with a
          single command:{" "}
          <code className="rounded bg-slate-200 px-1.5 py-0.5 text-sm dark:bg-white/10">
            npm run generate &lt;name&gt;
          </code>
        </Typography>
        <div className="flex flex-wrap justify-center gap-3">
          <Button
            component={Link}
            to="/products"
            variant="contained"
            size="large"
            endIcon={<ArrowRight size={18} />}
          >
            Try the Products demo
          </Button>
          <Button href="/api/health" target="_blank" variant="outlined" size="large">
            /api/health
          </Button>
        </div>
      </section>

      <motion.section
        variants={staggerContainer(0.08)}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
      >
        {highlights.map(({ icon: Icon, title, text }, index) => (
          <motion.div key={title} variants={fadeIn("up", "spring", index * 0.05, 0.6)}>
            <Paper variant="outlined" className="h-full p-6 transition-shadow hover:shadow-lg">
              <Icon className="mb-3 text-brand-600 dark:text-brand-500" size={28} />
              <Typography variant="h6" className="font-semibold">
                {title}
              </Typography>
              <Typography variant="body2" color="text.secondary" className="mt-1">
                {text}
              </Typography>
            </Paper>
          </motion.div>
        ))}
      </motion.section>
    </AnimatedPage>
  );
}
