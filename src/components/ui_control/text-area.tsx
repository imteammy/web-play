import type { Ref } from "react";
import type { FieldValues, Path } from "react-hook-form";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { cn } from "@/lib/utils";
import type { TextAreaControlProps } from "./base_model";
import { useTranslations } from "next-intl";
import { Textarea } from "../ui/textarea";
import { fixedForwardRef } from "@/hooks/fixedForwardRef";
import { mergeRef } from "@/hooks/merge-ref";

function TextAreaControlInner<
  TFieldValues extends FieldValues = FieldValues,
  TName extends Path<TFieldValues> = Path<TFieldValues>,
>(
  {
    name,
    control,
    defaultValue,
    disabled,
    rules,
    shouldUnregister,
    slot,
    id,
    type,
    readOnly,
    required,
    minLength,
    maxLength,
    ...props
  }: TextAreaControlProps<TFieldValues, TName>,
  ref: Ref<HTMLTextAreaElement>
) {
  const _defaultValue: any = defaultValue ?? "";
  const t = useTranslations("form.placeholder");
  return (
    <FormField
      name={name}
      control={control}
      rules={rules}
      defaultValue={_defaultValue}
      disabled={disabled}
      shouldUnregister={shouldUnregister}
      render={({ field, fieldState: { invalid, error } }) => {
        return (
          <FormItem className={cn("w-full", slot?.formItemsClassName)}>
            {props.label && (
              <FormLabel
                className={slot?.formLabelClassName}
                htmlFor={field.name}
              >
                {props.label}
              </FormLabel>
            )}
            <FormControl>
              <Textarea
                readOnly={readOnly}
                id={id ?? field.name}
                data-test-id={field.name}
                required={required}
                value={field.value}
                ref={mergeRef(field.ref, ref)}
                minLength={minLength}
                maxLength={maxLength}
                aria-invalid={invalid ? "true" : undefined}
                disabled={field.disabled}
                placeholder={props.placeholder ?? t("required")}
                className={cn(
                  {
                    "border-red-500 focus-visible:ring-1 focus-visible:ring-red-500 focus-visible:ring-offset-1":
                      invalid,
                  },
                  props.className
                )}
                onChange={(e) => {
                  props.onChange?.(e);
                  field.onChange();
                }}
                onBlur={(e) => {
                  props.onBlur?.(e);
                  field.onBlur();
                }}
              />
            </FormControl>
            <FormMessage />
            {props.description && (
              <FormDescription className={slot?.formDescriptionClassName}>
                {props.description}
              </FormDescription>
            )}
          </FormItem>
        );
      }}
    />
  );
}

export const TextAreaControl = fixedForwardRef(TextAreaControlInner);
