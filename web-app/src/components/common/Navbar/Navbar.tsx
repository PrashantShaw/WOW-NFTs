"use client";

import * as React from "react";
import Link from "next/link";

import { cn } from "@/lib/utils";

import SideNavSheet from "./SideNavSheet";
import NavbarActions from "./NavbarActions";
import { Sparkles } from "lucide-react";
import { SearchModal } from "../SearchModal";
import { BRAND } from "@/lib/constants";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
        isScrolled ? "shadow" : ""
      )}
    >
      <div className="container flex h-14 items-center px-6 mx-auto gap-3">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Sparkles />
            <span className="hidden font-bold lg:inline-block text-nowrap">
              {BRAND.name}
            </span>
          </Link>
          {/* <nav className="flex items-center space-x-0 text-sm font-medium">
            {NAV_LINKS.map(({ label, href }, idx) => (
              <NavLink key={idx} label={label} href={href} />
            ))}
          </nav> */}
          <SearchModal />
        </div>
        <SideNavSheet />
        <NavbarActions />
      </div>
    </header>
  );
}
