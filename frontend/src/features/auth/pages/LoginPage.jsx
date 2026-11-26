import { zodResolver } from "@hookform/resolvers/zod";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { LottieLight } from "lottie-react";
import { Eye, EyeOff, Lock, LogIn, Mail } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Navigate, useLocation, useNavigate } from "react-router";
import loginAnimation from "@/assets/json/LottieLogin.json";
import { AnimatedPage } from "@/components/ui/AnimatedPage";
import { notify } from "@/lib/notify";
import { useAuthStore, useIsAuthenticated } from "@/store/useAuthStore";
import { loginSchema } from "../auth.schema";

/**
 * Demo login: validates the form and stores a fake session in Zustand.
 * Replace `fakeLogin` with `api.post("/auth/login", data)` once you add an
 * auth module to the backend (npm run generate auth).
 */
const fakeLogin = async ({ email }) => {
  await new Promise((resolve) => setTimeout(resolve, 600));
  return { user: { email, name: email.split("@")[0] }, token: crypto.randomUUID() };
};

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const login = useAuthStore((s) => s.login);
  const isAuthenticated = useIsAuthenticated();
  const navigate = useNavigate();
  const location = useLocation();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(loginSchema) });

  // Where to go after login: the protected page that redirected here, or home.
  const redirectTo = location.state?.from ?? "/";

  if (isAuthenticated) return <Navigate to={redirectTo} replace />;

  const onSubmit = async (data) => {
    const session = await fakeLogin(data);
    login(session);
    notify.success(`Welcome, ${session.user.name}!`);
    navigate(redirectTo, { replace: true });
  };

  return (
    <AnimatedPage className="flex justify-center py-6">
      <Paper variant="outlined" className="grid w-full max-w-4xl overflow-hidden md:grid-cols-2">
        <div className="hidden items-center justify-center bg-brand-50 p-8 md:flex dark:bg-white/5">
          <LottieLight src={loginAnimation} autoplay loop className="size-72" />
        </div>

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4 p-8">
          <div>
            <Typography variant="h5" className="font-bold">
              Sign in
            </Typography>
            <Typography color="text.secondary" variant="body2">
              Welcome back! Please enter your details.
            </Typography>
          </div>

          <Alert severity="info" variant="outlined">
            Demo mode — any email and a 6+ character password will work.
          </Alert>

          <TextField
            label="Email"
            type="email"
            autoComplete="email"
            autoFocus
            {...register("email")}
            error={!!errors.email}
            helperText={errors.email?.message}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <Mail size={18} />
                  </InputAdornment>
                ),
              },
            }}
          />

          <TextField
            label="Password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            {...register("password")}
            error={!!errors.password}
            helperText={errors.password?.message}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock size={18} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setShowPassword((v) => !v)}
                      onMouseDown={(e) => e.preventDefault()}
                      edge="end"
                      size="small"
                    >
                      {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />

          <Button
            type="submit"
            variant="contained"
            size="large"
            loading={isSubmitting}
            startIcon={<LogIn size={18} />}
          >
            Sign in
          </Button>
        </form>
      </Paper>
    </AnimatedPage>
  );
}
