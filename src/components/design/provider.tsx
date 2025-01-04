"use client";
import React, { PropsWithChildren } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { getQueryClient } from "@/lib/getQueryClient";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { useCreateCustomErrorMap } from "@/lib/zodCustomErrorMap";
import { z } from "zod";
export const Provider = ({ children }: PropsWithChildren) => {
  const client = getQueryClient();
  const zodCustomErrorMap = useCreateCustomErrorMap();
  z.setErrorMap(zodCustomErrorMap);
  return (
    <QueryClientProvider client={client}>
      {children}

      <ReactQueryDevtools initialIsOpen={false} client={client} />
      <Toaster />
      <Sonner />
    </QueryClientProvider>
  );
};
