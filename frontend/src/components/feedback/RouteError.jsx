import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { isRouteErrorResponse, Link, useRouteError } from "react-router";

/** Rendered by React Router when a route throws while loading or rendering. */
export function RouteError() {
  const error = useRouteError();
  const message = isRouteErrorResponse(error)
    ? `${error.status} — ${error.statusText}`
    : (error?.message ?? "Something went wrong");

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-6 text-center">
      <Typography variant="h4" className="font-bold">
        Oops!
      </Typography>
      <Typography color="text.secondary">{message}</Typography>
      {import.meta.env.DEV && error?.stack && (
        <pre className="max-w-3xl overflow-auto rounded-lg bg-slate-100 p-4 text-left text-xs dark:bg-white/5">
          {error.stack}
        </pre>
      )}
      <Button component={Link} to="/" variant="contained">
        Back to home
      </Button>
    </div>
  );
}
