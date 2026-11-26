import Typography from "@mui/material/Typography";

export function PageHeader({ title, description, action }) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        <Typography variant="h4" component="h1" className="font-bold">
          {title}
        </Typography>
        {description && (
          <Typography color="text.secondary" className="mt-1">
            {description}
          </Typography>
        )}
      </div>
      {action}
    </div>
  );
}
