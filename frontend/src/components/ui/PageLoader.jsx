import { LottieLight } from "lottie-react";
import loadingAnimation from "@/assets/json/pageLoading.json";

export function PageLoader() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <LottieLight src={loadingAnimation} autoplay loop className="size-40" aria-label="Loading" />
    </div>
  );
}
