import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { BRAND, NAV_LINKS } from "@/lib/constants";
import { Menu } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
// TODO: replace sidenav links with something better
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
              <Link href="/" className="mr-6 flex items-center space-x-2">
                <Image
                  src={"/icon.png"}
                  width={32}
                  height={32}
                  alt="brand logo"
                />
                <span className="text-center">{BRAND.name}</span>
              </Link>
            </div>
          </SheetTitle>
          <SheetDescription>
            <nav className="flex flex-col space-y-4">
              <Link href={"/"} className="transition-colors hover:text-primary">
                Home
              </Link>
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
