"use client";
import { useLocale, useTranslations } from "next-intl";
import React from "react";
import { useFormContext } from "react-hook-form";
export function FormError({ name }: { name: string }) {
  const { getFieldState, formState } = useFormContext();
  const t = useTranslations('zod')
  const error = getFieldState(name, formState)?.error;
  if (!error?.message) return null;
  return <div className="text-red-500">{error.message}</div>;
}
