// Page organization adapted from shadcn-admin, shared with the beginner preview.
import { useNavigate, useSearch } from "@tanstack/react-router";
import { useThemeStore } from "@/stores/theme-store";
import { ApplicationPreview } from "./app-preview";

export default function ExamplePages() {
  const { q, view } = useSearch({ from: "__root__" });
  const navigate = useNavigate();
  const theme = useThemeStore((s) => s.theme);
  return <ApplicationPreview name={theme.name} navigation={theme.navigation} view={view}
    onViewChange={(view) => void navigate({ to: "/pages", search: { q: "", view } })}
    filter={q} onFilterChange={(q) => void navigate({ to: "/pages", search: { q, view: "projects" }, replace: true })} />;
}
