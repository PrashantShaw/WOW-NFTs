import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";

type NavLinkProps = {
  label: string;
  href: string;
};
const NavLink = ({ label, href }: NavLinkProps) => {
  return (
    <Link href={href} className="transition-colors hover:text-primary">
      <Button variant={"ghost"}>{label}</Button>
    </Link>
  );
};

export default NavLink;
