import { ConfiguredButton as Button } from "@/components/configured-components";
import { Input } from "@/components/ui/input";
import { FieldGroup, FieldLabel } from "@/components/ui/field";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { DialogFooter } from "@/components/ui/dialog";
import { Field, FieldError } from "@/components/ui/field";
import { Choice } from "@/components/common";
import type { Project } from "./project-data";
import { RequiredMark, useInterfaceOptions } from "@/design-system/interface-context";
import { validationModes } from "@/design-system/interface-options";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const statuses = ["规划中", "进行中", "已完成"] as const;
const schema = z.object({
  name: z.string().trim().min(2, "项目名称至少 2 个字符").max(60, "项目名称最多 60 个字符"),
  status: z.enum(statuses),
});
type Values = z.infer<typeof schema>;

export function ProjectDetailsForm({ project, pending, onSave, onCancel }: {
  project: Project;
  pending: boolean;
  onSave: (project: Project) => void;
  onCancel: () => void;
}) {
  const options = useInterfaceOptions();
  const { register, control, handleSubmit, formState: { errors } } = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { name: project.name, status: project.status },
    mode: validationModes[options.validationMode],
    reValidateMode: validationModes[options.validationMode],
  });
  return <form className="flex flex-col gap-5" noValidate onSubmit={handleSubmit((values) => onSave({ ...project, ...values }))}>
    {options.errorPlacement === "summary" && errors.name && <Alert variant="destructive" role="alert"><AlertTitle>请检查项目名称</AlertTitle><AlertDescription id="project-name-error">{errors.name.message}</AlertDescription></Alert>}
    <FieldGroup>
      <Field data-invalid={!!errors.name}>
        <FieldLabel htmlFor="project-name">项目名称<RequiredMark /></FieldLabel>
        <Input id="project-name" aria-required="true" aria-invalid={!!errors.name} aria-describedby={errors.name ? "project-name-error" : undefined} {...register("name")} />
        {options.errorPlacement === "inline" && <FieldError id="project-name-error">{errors.name?.message}</FieldError>}
      </Field>
      <Controller name="status" control={control} render={({ field, fieldState }) => <Field data-invalid={!!fieldState.error}>
        <FieldLabel htmlFor="project-status">状态</FieldLabel>
        <Choice label="项目状态" value={field.value} onChange={field.onChange} triggerProps={{ id: "project-status", ref: field.ref, onBlur: field.onBlur, "aria-invalid": !!fieldState.error, "aria-describedby": fieldState.error ? "project-status-error" : undefined }} options={statuses.map((status) => ({ value: status, label: status }))} />
        <FieldError id="project-status-error">{fieldState.error?.message}</FieldError>
      </Field>} />
    </FieldGroup>
    <DialogFooter>
      <Button type="button" variant="outline" onClick={onCancel}>取消</Button>
      <Button type="submit" disabled={pending}>{pending ? "保存中…" : "保存项目"}</Button>
    </DialogFooter>
  </form>;
}
