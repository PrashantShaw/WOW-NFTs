import Link from "next/link";
import { Sparkles } from "lucide-react";
import { LinkedinIcon } from "../icons/Linkedin";
import { GithubIcon } from "../icons/Github";
import { TwitterIcon } from "../icons/Twitter";

export default function Footer() {
  return (
    <footer className="border-t px-6 mt-16">
      <div className="container flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0">
        <div className="flex items-center gap-4">
          <Sparkles className="h-6 w-6" />
          <span className="text-xl font-bold">NFT Market</span>
        </div>
        <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
          Built by{" "}
          <a
            href="https://www.linkedin.com/in/prashant-shaw/"
            target="_blank"
            rel="noreferrer"
            className="font-medium underline underline-offset-4"
          >
            Prashant Shaw
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
          <Link
            href="https://github.com/PrashantShaw"
            target="_blank"
            rel="noreferrer"
          >
            <GithubIcon />
            <span className="sr-only">GitHub</span>
          </Link>
          <Link
            href="https://www.linkedin.com/in/prashant-shaw/"
            target="_blank"
            rel="noreferrer"
          >
            <LinkedinIcon />
            <span className="sr-only">LinkedIn</span>
          </Link>
          <Link
            href="https://x.com/ImPrashantShaw"
            target="_blank"
            rel="noreferrer"
          >
            <TwitterIcon />
            <span className="sr-only">Twitter</span>
          </Link>
        </div>
      </div>
    </footer>
  );
}
