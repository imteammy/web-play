import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Projects() {
  return (
    <div className="space-y-3">
      <h1 className="text-3xl font-bold mb-4">My Projects</h1>
      <div className="flex gap-4 flex-col">
        <a href="/form">
          <Button type="button">React hook form - advance schema</Button>
        </a>
        <a href="/nextjs">
          <Button type="button">Nextjs generate routes handler</Button>
        </a>
      </div>
    </div>
  );
}
