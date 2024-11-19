import Navbar from "@/components/common/Navbar/Navbar";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main>
      <Navbar />
      <p>Home page</p>
      <Button>Button</Button>
      <p>Some text</p>
    </main>
  );
}
