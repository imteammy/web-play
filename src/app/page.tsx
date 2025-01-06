import { NavBar } from "@/components/nav-bar";
import HomePage from "./_page";
export default function Page() {
  return (
    <div className="container mx-auto">
      <NavBar />
      <div className="container mx-auto my-2">
        <HomePage />
      </div>
    </div>
  );
}
