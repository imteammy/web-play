import { NavBar } from "@/components/nav-bar";
import { type ReactNode } from "react";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="container mx-auto">
      <NavBar />
      <div className="container mx-auto my-2">{children}</div>
    </div>
  );
}
