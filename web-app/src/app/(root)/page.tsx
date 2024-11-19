import Navbar from "@/components/common/Navbar/Navbar";
import { Button } from "@/components/ui/button";
import Hero from "./_components/Hero";

export default function Home() {
  return (
    <main className="">
      <Navbar />
      <div className="container px-6 mx-auto">
        <Hero />
        <p>Home page</p>
        <Button>Button</Button>
        <p>Some text</p>
      </div>
    </main>
  );
}
