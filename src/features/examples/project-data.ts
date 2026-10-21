import { queryOptions } from "@tanstack/react-query";
import { readLocal, saveLocal } from "@/lib/files";
export type Project = {
  id: string;
  name: string;
  category: string;
  status: "规划中" | "进行中" | "已完成";
  owner: string;
  updated: string;
};
export const initialProjects: Project[] = [
  {
    id: "PRJ-001",
    name: "门店订单整理",
    category: "运营",
    status: "进行中",
    owner: "林",
    updated: "2026-10-21",
  },
  {
    id: "PRJ-002",
    name: "客户回访记录",
    category: "客户",
    status: "规划中",
    owner: "陈",
    updated: "2026-10-20",
  },
  {
    id: "PRJ-003",
    name: "十月活动筹备",
    category: "活动",
    status: "进行中",
    owner: "周",
    updated: "2026-10-19",
  },
  {
    id: "PRJ-004",
    name: "商品资料更新",
    category: "资料",
    status: "规划中",
    owner: "王",
    updated: "2026-10-18",
  },
  {
    id: "PRJ-005",
    name: "本周发货安排",
    category: "运营",
    status: "已完成",
    owner: "林",
    updated: "2026-10-17",
  },
  {
    id: "PRJ-006",
    name: "新店开业准备",
    category: "活动",
    status: "进行中",
    owner: "陈",
    updated: "2026-10-16",
  },
  {
    id: "PRJ-007",
    name: "节日问候发送",
    category: "客户",
    status: "已完成",
    owner: "周",
    updated: "2026-10-15",
  },
  {
    id: "PRJ-008",
    name: "客户建议整理",
    category: "客户",
    status: "规划中",
    owner: "王",
    updated: "2026-10-14",
  },
  {
    id: "PRJ-009",
    name: "商品照片归档",
    category: "资料",
    status: "进行中",
    owner: "周",
    updated: "2026-10-13",
  },
  {
    id: "PRJ-010",
    name: "日常采购清单",
    category: "运营",
    status: "已完成",
    owner: "林",
    updated: "2026-10-12",
  },
];
export const projectsOptions = queryOptions({
  queryKey: ["projects"],
  queryFn: async () =>
    readLocal<Project[]>("frontend-starters-v1", initialProjects),
  staleTime: 60000,
});
export async function putProject(project: Project) {
  const rows = readLocal<Project[]>("frontend-starters-v1", initialProjects);
  const exists = rows.some((p) => p.id === project.id);
  saveLocal(
    "frontend-starters-v1",
    exists
      ? rows.map((p) => (p.id === project.id ? project : p))
      : [project, ...rows],
  );
  return project;
}
export async function deleteProject(id: string) {
  saveLocal(
    "frontend-starters-v1",
    readLocal<Project[]>("frontend-starters-v1", initialProjects).filter(
      (p) => p.id !== id,
    ),
  );
}
