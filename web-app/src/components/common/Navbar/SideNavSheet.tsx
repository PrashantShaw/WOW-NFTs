import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { NAV_LINKS } from "@/lib/constants";
import { Menu, Sparkles } from "lucide-react";
import Link from "next/link";
const SideNavSheet = () => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left">
        <SheetHeader className="">
          <SheetTitle className=" py-6">
            <div className="flex items-center justify-center sm:justify-start space-x-2">
              <Sparkles className="text-center" />
              <span className="text-center">NFT Market</span>
            </div>
          </SheetTitle>
          <SheetDescription>
            <nav className="flex flex-col space-y-4">
              {NAV_LINKS.map(({ label, href }, idx) => (
                <Link
                  key={idx}
                  href={href}
                  className="transition-colors hover:text-primary"
                >
                  {label}
                </Link>
              ))}
            </nav>
          </SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
};

export default SideNavSheet;
