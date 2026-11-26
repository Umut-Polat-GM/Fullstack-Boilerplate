export function Footer() {
  return (
    <footer className="border-t border-slate-200 py-6 text-center text-sm text-slate-500 dark:border-white/10 dark:text-slate-400">
      © {new Date().getFullYear()} {import.meta.env.VITE_APP_NAME || "Fullstack Boilerplate"} —
      Express · PostgreSQL · React · MUI · Tailwind
    </footer>
  );
}
