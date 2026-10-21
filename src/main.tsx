import { StrictMode, lazy, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "@tanstack/react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { router } from "./router";
import { PreviewBoundary, PreviewLoading } from "@/features/guide/preview-boundary";
import "./index.css";
const client = new QueryClient({
  defaultOptions: { queries: { retry: 1, refetchOnWindowFocus: false } },
});
const FramePreview = lazy(() => import("@/features/guide/frame"));
const isPreview = new URLSearchParams(window.location.search).get("__preview") === "1";
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={client}>
      <TooltipProvider>
        {isPreview ? <PreviewBoundary><Suspense fallback={<PreviewLoading />}><FramePreview /></Suspense></PreviewBoundary> : <RouterProvider router={router} />}
      </TooltipProvider>
    </QueryClientProvider>
  </StrictMode>,
);
