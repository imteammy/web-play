import React, { HTMLInputTypeAttribute, Ref } from "react";
import {
  type Control,
  FieldPathValue,
  FieldValues,
  Path,
  RegisterOptions,
} from "react-hook-form";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { cn } from "@/lib/utils";
import { InputControlProps } from "./base_model";
import { useTranslations } from "next-intl";
import { fixedForwardRef } from "@/hooks/fixedForwardRef";
import { mergeRef } from "@/hooks/merge-ref";

function InputControlInner<
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
    min,
    minLength,
    max,
    maxLength,
    ...props
  }: InputControlProps<TFieldValues, TName>,
  ref: Ref<HTMLInputElement>
) {
  const _defaultValue: any =
    defaultValue ?? (type === "number" ? undefined : "");
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
              <Input
                readOnly={readOnly}
                type={type}
                id={id ?? field.name}
                data-test-id={field.name}
                required={required}
                value={field.value}
                ref={mergeRef(field.ref, ref)}
                min={min}
                minLength={minLength}
                max={max}
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
                  field.onChange(
                    type === "number" ? e.target.valueAsNumber : e
                  );
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

export const InputControl = fixedForwardRef(InputControlInner);
