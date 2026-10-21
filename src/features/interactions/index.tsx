import { PresetButton as Button } from "@/components/preset-controls";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { BoardDemo } from "./board";

import { PageIntro } from "@/components/common";
import { useThemeStore } from "@/stores/theme-store";
export default function InteractionsPage() {
  const [visible, setVisible] = useState(true);
  const reduced = !useThemeStore((s) => s.theme.motion);
  return (
    <div className="page-content">
      <PageIntro
        title="交互实验室"
        description="dnd-kit 负责拖拽，Motion 负责入场与退出，避免争用同一元素的 transform。"
      />
      <BoardDemo />
      <section className="mt-5 border-t pt-6">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-medium">入场与退出</h2>
            <p className="mt-1 text-xs text-muted-foreground">
              统一 160ms ease-out，遵循减少动态效果偏好。
            </p>
          </div>
          <Button variant="outline" onClick={() => setVisible(!visible)}>
            {visible ? "隐藏面板" : "显示面板"}
          </Button>
        </div>
        <div className="min-h-24">
          <AnimatePresence>
            {visible && (
              <motion.div
                key="motion-demo"
                initial={{ opacity: 0, y: reduced ? 0 : 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: reduced ? 0 : -4 }}
                transition={{ duration: reduced ? 0 : 0.16, ease: "easeOut" }}
                className="rounded-lg border p-5 text-sm"
              >
                状态改变时，让动画帮助用户理解变化。
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
    </div>
  );
}
