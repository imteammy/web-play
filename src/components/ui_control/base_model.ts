import { HTMLInputTypeAttribute } from "react";
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
  control?: Control<TFieldValues, any> & {};
  disabled?: boolean;
  readOnly?: boolean;
  label?: string;
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
