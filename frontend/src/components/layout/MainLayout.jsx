import Container from "@mui/material/Container";
import { Suspense } from "react";
import { Outlet, ScrollRestoration, useNavigation } from "react-router";
import LinearProgress from "@mui/material/LinearProgress";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { PageLoader } from "@/components/ui/PageLoader";
import { Footer } from "./Footer";
import { Navbar } from "./Navbar";

export function MainLayout() {
  const navigation = useNavigation();

  return (
    <div className="flex min-h-screen flex-col">
      {navigation.state === "loading" && (
        <LinearProgress className="fixed inset-x-0 top-0 z-[2000]" color="secondary" />
      )}
      <Navbar />
      <Container component="main" maxWidth="lg" className="flex-1 py-8">
        <Suspense fallback={<PageLoader />}>
          <Outlet />
        </Suspense>
      </Container>
      <Footer />
      <ConfirmDialog />
      <ScrollRestoration />
    </div>
  );
}
