import { BaseLayout } from "@/components/base-layout";
import { type ReactNode } from "react";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return <BaseLayout>{children}</BaseLayout>;
}
