// Render matching registry/preset compositions for browser-level default-style comparison.
import { createServer } from "vite";
import { createElement as h } from "react";
import { renderToStaticMarkup } from "react-dom/server";

export async function renderDefaultFixture() {
  const server = await createServer({ server: { middlewareMode: true, hmr: false, watch: null }, logLevel: "error" });
  try {
    const [button, card, field, input, textarea, toggle, tabs, checkbox, switchControl, preset] = await Promise.all(
      ["button", "card", "field", "input", "textarea", "toggle-group", "tabs", "checkbox", "switch", "../configured-components"].map((name) => server.ssrLoadModule(`/src/components/ui/${name}.tsx`)),
    );
    const compose = (kind) => {
      const native = kind === "native";
      const get = (module, name) => !native && ["Button", "ToggleGroup", "TabsList"].includes(name) ? preset[`Configured${name}`] : module[name];
      return h("div", { "data-parity": kind, style: { display: "flex", flexDirection: "column", gap: "24px", width: "300px" } },
        h(get(button, "Button"), { "data-test": "button" }, "保存设置"),
        h(get(button, "Button"), { "data-test": "outline", variant: "outline", size: "sm" }, "次要操作"),
        h(get(card, "Card"), { "data-test": "card" }, h(card.CardHeader, null, h(card.CardTitle, null, "个人资料")), h(card.CardContent, null, "内容")),
        h(get(field, "FieldGroup"), { "data-test": "field-group" }, h(field.Field, null, h(get(field, "FieldLabel"), { htmlFor: `${kind}-input`, "data-test": "label" }, "名称"), h(get(input, "Input"), { id: `${kind}-input`, "data-test": "input", defaultValue: "小林" }))),
        h(get(textarea, "Textarea"), { "data-test": "textarea", defaultValue: "备注" }),
        h(get(toggle, "ToggleGroup"), { "data-test": "toggle-group", type: "single", defaultValue: "first", variant: "outline" }, h(get(toggle, "ToggleGroupItem"), { value: "first", "data-test": "toggle-selected" }, "本周"), h(get(toggle, "ToggleGroupItem"), { value: "second" }, "本月")),
        h(tabs.Tabs, { defaultValue: "first" }, h(get(tabs, "TabsList"), { "data-test": "tabs" }, h(get(tabs, "TabsTrigger"), { value: "first", "data-test": "tab-selected" }, "概览"), h(get(tabs, "TabsTrigger"), { value: "second" }, "活动"))),
        h(get(checkbox, "Checkbox"), { "data-test": "checkbox", defaultChecked: true, "aria-label": "复选框" }),
        h(get(switchControl, "Switch"), { "data-test": "switch", defaultChecked: true, "aria-label": "开关" }),
      );
    };
    return renderToStaticMarkup(h("div", { id: "default-parity", style: { display: "flex", gap: "32px", padding: "24px" } }, compose("native"), compose("preset")));
  } finally {
    await server.close();
  }
}
