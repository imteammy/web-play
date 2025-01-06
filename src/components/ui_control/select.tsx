import React, { HTMLInputTypeAttribute } from "react";
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
import { cn } from "@/lib/utils";
import { SelectControlProps } from "./base_model";

export function SelectControl<
  TFieldValues extends FieldValues = FieldValues,
  TName extends Path<TFieldValues> = Path<TFieldValues>,
>({
  name,
  control,
  defaultValue,
  disabled,
  rules,
  shouldUnregister,
  slot,
  id,
  ...props
}: SelectControlProps<TFieldValues, TName>) {
  return (
    <FormField
      name={name}
      control={control}
      rules={rules}
      defaultValue={defaultValue}
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
              <select
                autoComplete="off"
                id={id ?? field.name}
                className={cn(invalid && "border-red-500")}
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                ref={field.ref}
                disabled={field.disabled}
                required={props.required}
              >
                {props.options?.map((v) => (
                  <option key={v.value} id={v.value} value={v.value}>
                    {v.label}
                  </option>
                ))}
              </select>
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
