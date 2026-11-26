import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { LottieLight } from "lottie-react";
import { Link } from "react-router";
import notFoundAnimation from "@/assets/json/404NotFound.json";
import { AnimatedPage } from "@/components/ui/AnimatedPage";

export default function NotFoundPage() {
  return (
    <AnimatedPage className="flex flex-col items-center gap-4 py-10 text-center">
      <LottieLight src={notFoundAnimation} autoplay loop className="h-72 w-full max-w-md" />
      <Typography variant="h5" className="font-semibold">
        Page not found
      </Typography>
      <Typography color="text.secondary">The page you are looking for does not exist.</Typography>
      <Button component={Link} to="/" variant="contained">
        Back to home
      </Button>
    </AnimatedPage>
  );
}
