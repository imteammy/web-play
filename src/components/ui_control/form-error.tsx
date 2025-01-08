"use client";
import { useLocale, useTranslations } from "next-intl";
import React from "react";
import { useFormContext } from "react-hook-form";
export function FormError({ name }: { name: string }) {
  const { getFieldState, formState } = useFormContext();
  const t = useTranslations("zod");
  const { error } = getFieldState(name, formState);
  const message = error?.message;
  if (!message) return null;
  const [smg, params] = message.split("||");

  return (
    <div className="text-red-500">
      {t(smg as any, JSON.parse(params || "{}"))}
    </div>
  );
}
