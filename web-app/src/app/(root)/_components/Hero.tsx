import { Button } from "@/components/ui/button";
import { GraduationCap, Library } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
// TODO: visit part 1 starting and see how things work - https://www.youtube.com/watch?v=Uuwi2vNmMj0&t=1s
const Hero = () => {
  return (
    <div className="pt-12 sm:pt-24 pb-16 sm:pb-28">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 lg:gap-0">
        <div className="flex flex-col justify-center items-center lg:items-start pl-4 gap-6">
          <h1 className="text-5xl sm:text-6xl leading-[3.5rem] sm:leading-[5rem] font-bold text-balance text-center lg:text-left">
            Discover, collect, and sell NFTs
          </h1>
          <p className="text-lg text-balance text-center lg:text-left">
            Discover the most outstanding NFTs in all topics of life. Create
            your own NFTs and sell them!
          </p>
          <div className="flex flex-wrap justify-center gap-4 pt-6 sm:pt-10">
            <Link href={"/nft/collections"}>
              <Button className="text-lg font-medium " size={"lg"}>
                Collections
                <Library strokeWidth={3} />
              </Button>
            </Link>
            <Link href={"/#learn"}>
              <Button
                className="text-lg font-medium "
                variant={"secondary"}
                size={"lg"}
              >
                Know More
                <GraduationCap strokeWidth={3} />
              </Button>
            </Link>
          </div>
        </div>
        <div className="">
          <Image
            src="/hero6.png"
            alt="Hero Banner"
            width={1024}
            height={1024}
            className="w-full lg:translate-x-[-2rem]"
          />
        </div>
      </div>
    </div>
  );
};

export default Hero;
