import Link from "next/link";
import { LinkedinIcon } from "../icons/Linkedin";
import { GithubIcon } from "../icons/Github";
import { TwitterIcon } from "../icons/Twitter";
import { BRAND } from "@/lib/constants";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="border-t px-6 mt-[6rem]">
      <div className="container flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0">
        <div className="flex items-center gap-3">
          <Image src={"/icon.png"} width={40} height={40} alt="brand logo" />
          <span className="text-xl font-bold">{BRAND.name}</span>
        </div>
        <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
          Built by{" "}
          <a
            href={BRAND.linkedin}
            target="_blank"
            rel="noreferrer"
            className="font-medium underline underline-offset-4"
          >
            {BRAND.owner}
          </a>
          . Hosted on{" "}
          <a
            href="https://vercel.com"
            target="_blank"
            rel="noreferrer"
            className="font-medium underline underline-offset-4"
          >
            Vercel
          </a>
          .
        </p>
        <div className="flex gap-4">
          <Link href={BRAND.github} target="_blank" rel="noreferrer">
            <GithubIcon />
            <span className="sr-only">GitHub</span>
          </Link>
          <Link href={BRAND.linkedin} target="_blank" rel="noreferrer">
            <LinkedinIcon />
            <span className="sr-only">LinkedIn</span>
          </Link>
          <Link href={BRAND.twitter} target="_blank" rel="noreferrer">
            <TwitterIcon />
            <span className="sr-only">Twitter</span>
          </Link>
        </div>
      </div>
    </footer>
  );
}
