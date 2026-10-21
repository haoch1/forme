import { Link } from "@tanstack/react-router";
import { Check, ChevronRight } from "lucide-react";
import { PresetButton as Button } from "@/components/preset-controls";

export function GuideSteps({ current, onStep }: { current: 1 | 2 | 3; onStep?: (step: 1 | 2) => void }) {
  return (
    <nav aria-label="设置步骤" className="guide-steps">
      {(["选个风格", "调整效果", "交给 AI"] as const).map((label, index) => {
        const number = index + 1;
        const content = <><span className="step-number">{number < current ? <Check className="size-3.5" /> : number}</span><span>{label}</span></>;
        return <div key={label} className="guide-step-item">
          {number === 3 ? <Link to="/starter" search={{ q: "", view: "projects" }} className="guide-step" aria-current={current === 3 ? "step" : undefined}>{content}</Link>
            : onStep ? <Button type="button" variant="ghost" className="guide-step" aria-current={current === number ? "step" : undefined} onClick={() => onStep(number as 1 | 2)}>{content}</Button>
              : <Link to="/" search={{ q: "", view: "projects" }} hash={number === 2 ? "adjust" : ""} className="guide-step">{content}</Link>}
          {number !== 3 && <ChevronRight className="step-chevron size-3.5" />}
        </div>;
      })}
    </nav>
  );
}
