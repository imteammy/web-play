import Home from "@/components/public/homepage";
import { NavBar } from "@/components/public/nav-bar";

export default function Page() {
  return (
    <div className="container mx-auto">
      <NavBar />
      <div className="container mx-auto my-2">
        <Home />
      </div>
    </div>
  );
}
