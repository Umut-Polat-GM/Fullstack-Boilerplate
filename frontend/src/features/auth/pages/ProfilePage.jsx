import Avatar from "@mui/material/Avatar";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { AnimatedPage } from "@/components/ui/AnimatedPage";
import { PageHeader } from "@/components/ui/PageHeader";
import { useAuthStore } from "@/store/useAuthStore";

/** Example of a protected page (`auth: true` in the feature manifest). */
export default function ProfilePage() {
  const user = useAuthStore((s) => s.user);

  return (
    <AnimatedPage>
      <PageHeader title="Profile" description="This route is only visible to signed-in users." />
      <Paper variant="outlined" className="flex items-center gap-4 p-6">
        <Avatar sx={{ width: 56, height: 56, bgcolor: "primary.main" }}>
          {user?.name?.[0]?.toUpperCase()}
        </Avatar>
        <div>
          <Typography variant="h6">{user?.name}</Typography>
          <Typography color="text.secondary">{user?.email}</Typography>
        </div>
      </Paper>
    </AnimatedPage>
  );
}
