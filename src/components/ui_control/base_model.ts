import { HTMLInputTypeAttribute, ReactNode } from "react";
import {
  Control,
  FieldPathValue,
  FieldValues,
  Path,
  RegisterOptions,
} from "react-hook-form";

interface BaseControlProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends Path<TFieldValues> = Path<TFieldValues>,
> {
  name: TName;
  rules?: Omit<
    RegisterOptions<TFieldValues, TName>,
    "valueAsNumber" | "valueAsDate" | "setValueAs" | "disabled"
  >;
  shouldUnregister?: boolean;
  defaultValue?: FieldPathValue<TFieldValues, TName>;
  control?: Control<TFieldValues, any>;
  disabled?: boolean;
  readOnly?: boolean;
  label?: ReactNode;
  required?: boolean;
  className?: string;
  id?: string;
  slot?: {
    formItemsClassName?: string;
    formLabelClassName?: string;
    formDescriptionClassName?: string;
  };
  placeholder?: string;
  description?: string;
  min?: number | string | undefined;
  minLength?: number | undefined;
  max?: number | string | undefined;
  maxLength?: number | undefined;
}

export interface SelectControlProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends Path<TFieldValues> = Path<TFieldValues>,
> extends BaseControlProps<TFieldValues, TName> {
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  onBlur?: React.FocusEventHandler<HTMLInputElement>;
  options?: {
    label: string;
    value: string;
  }[];
}

export interface InputControlProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends Path<TFieldValues> = Path<TFieldValues>,
> extends BaseControlProps<TFieldValues, TName> {
  type?: HTMLInputTypeAttribute;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  onBlur?: React.FocusEventHandler<HTMLInputElement>;
}
export interface TextAreaControlProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends Path<TFieldValues> = Path<TFieldValues>,
> extends Omit<BaseControlProps<TFieldValues, TName>, "min" | "max"> {
  type?: HTMLInputTypeAttribute;
  onChange?: React.ChangeEventHandler<HTMLTextAreaElement>;
  onBlur?: React.FocusEventHandler<HTMLTextAreaElement>;
}
