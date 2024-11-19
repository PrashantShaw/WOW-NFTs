import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import React from "react";
// TODO: visit part 1 starting and see how things work - https://www.youtube.com/watch?v=Uuwi2vNmMj0&t=1s
const Hero = () => {
  return (
    <div className="sm:py-32 py-28">
      <div className="flex flex-col items-center gap-6 max-w-[35rem] mx-auto">
        <h1 className="text-6xl font-bold text-balance text-center">
          Discover, collect, and sell NFTs
        </h1>
        <p className="text-center text-lg">
          Discover the most outstanding NFTs in all topics of life. Create your
          own NFTs and sell them!
        </p>
        <Link href={"/nft/create"}>
          <Button className="text-lg font-semibold ">
            Create
            <Plus strokeWidth={4} />
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default Hero;
