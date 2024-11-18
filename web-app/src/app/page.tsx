import Navbar from "@/components/common/Navbar";
import { ThemeToggler } from "@/components/common/ThemeToggler";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main>
      <Navbar />
      <p>Home page</p>
      <Button>Button</Button>
      <ThemeToggler />
      <p>Some text</p>
    </main>
  );
}
