import { PresetButton as Button, PresetInput as Input, PresetTextarea as Textarea, PresetFieldGroup as FieldGroup, PresetFieldLabel as FieldLabel } from "@/components/preset-controls";
// Form organization adapted from satnaing/shadcn-admin; migrated to shadcn Field and local storage.
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Field, FieldDescription, FieldError } from "@/components/ui/field";
import { toast } from "sonner";
import { readLocal, saveLocal } from "@/lib/files";
import { DetailCopy, RequiredMark, useInterfaceOptions } from "@/design-system/interface-context";
import { validationModes } from "@/design-system/interface-options";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
const schema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "请至少输入 2 个字符")
    .max(40, "最多 40 个字符"),
  email: z.email("请输入有效的邮箱地址"),
  description: z.string().max(200, "最多 200 个字符"),
});
type Values = z.infer<typeof schema>;
export function ProfileForm({ idPrefix = "profile" }: { idPrefix?: string }) {
  const options = useInterfaceOptions();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
    reset,
  } = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: readLocal<Values>("style-profile-v1", {
      name: "小林",
      email: "hello@example.com",
      description: "在这里记录工作和生活。",
    }),
    mode: validationModes[options.validationMode],
    reValidateMode: validationModes[options.validationMode],
  });
  const submit = handleSubmit((values) => {
    try {
      saveLocal("style-profile-v1", values);
      reset(values);
      toast.success("资料已保存到本机");
    } catch {
      toast.error("保存失败，请检查浏览器存储空间后重试");
    }
  });
  return (
    <form onSubmit={submit} className="flex flex-col gap-6" noValidate>
      {options.errorPlacement === "summary" && Object.keys(errors).length > 0 && <Alert variant="destructive" role="alert"><AlertTitle>请检查以下内容</AlertTitle><AlertDescription><ul className="list-inside list-disc">{Object.entries(errors).map(([key, error]) => <li key={key} id={`${idPrefix}-${key}-error`}>{error.message}</li>)}</ul></AlertDescription></Alert>}
      <FieldGroup>
        <Field data-invalid={!!errors.name}>
          <FieldLabel htmlFor={`${idPrefix}-name`}>名称<RequiredMark /></FieldLabel>
          <Input
            id={`${idPrefix}-name`}
            placeholder="你的名字或昵称"
            aria-invalid={!!errors.name}
            aria-required="true"
            aria-describedby={`${idPrefix}-name-description${errors.name ? ` ${idPrefix}-name-error` : ""}`}
            {...register("name")}
          />
          <FieldDescription id={`${idPrefix}-name-description`}><DetailCopy short="让同伴知道怎么称呼你" full="填写你的名字或昵称，保存后会保留在当前浏览器中。" /></FieldDescription>
          {options.errorPlacement === "inline" && <FieldError id={`${idPrefix}-name-error`}>{errors.name?.message}</FieldError>}
        </Field>
        <Field data-invalid={!!errors.email}>
          <FieldLabel htmlFor={`${idPrefix}-email`}>联系邮箱<RequiredMark /></FieldLabel>
          <Input
            id={`${idPrefix}-email`}
            type="email"
            aria-invalid={!!errors.email}
            aria-required="true"
            aria-describedby={errors.email ? `${idPrefix}-email-error` : undefined}
            {...register("email")}
          />
          {options.errorPlacement === "inline" && <FieldError id={`${idPrefix}-email-error`}>{errors.email?.message}</FieldError>}
        </Field>
        <Field data-invalid={!!errors.description}>
          <FieldLabel htmlFor={`${idPrefix}-description`}>简介</FieldLabel>
          <Textarea
            id={`${idPrefix}-description`}
            rows={3}
            aria-invalid={!!errors.description}
            aria-describedby={`${idPrefix}-description-hint${errors.description ? ` ${idPrefix}-description-error` : ""}`}
            {...register("description")}
          />
          <FieldDescription id={`${idPrefix}-description-hint`}>最多 200 个字符</FieldDescription>
          {options.errorPlacement === "inline" && <FieldError id={`${idPrefix}-description-error`}>{errors.description?.message}</FieldError>}
        </Field>
      </FieldGroup>
      <div className="flex items-center gap-3">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "保存中…" : "保存资料"}
        </Button>
        <span className="text-xs text-muted-foreground" aria-live="polite">
          {isDirty ? "有未保存的更改" : "已与本地记录同步"}
        </span>
      </div>
    </form>
  );
}
