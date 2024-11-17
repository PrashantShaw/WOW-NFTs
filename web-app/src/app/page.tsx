import { ThemeToggler } from "@/components/common/ThemeToggler";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main>
      <p>Home page</p>
      <Button>Button</Button>
      <ThemeToggler />
      <p>Some text</p>
    </main>
  );
}
