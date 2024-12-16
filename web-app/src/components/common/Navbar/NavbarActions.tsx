"use client";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlignVerticalJustifyEnd,
  LayoutDashboard,
  List,
  Plus,
  Unplug,
} from "lucide-react";
import { ThemeToggler } from "../ThemeToggler";
import Link from "next/link";
import { useAccount, useDisconnect } from "wagmi";
import Image from "next/image";
import useConnectWallet from "@/hooks/useConnectWallet";
import { encodeText, shortedAccountAddress } from "@/lib/utils";
import { useRouter } from "next/navigation";
const NavbarActions = () => {
  const { isConnected, address } = useAccount();
  const { connectToWallet } = useConnectWallet();

  return (
    <div className="flex flex-1 items-center justify-end ">
      <nav className="flex items-center space-x-0">
        <ThemeToggler />
        <div className="w-2 md:w-3" />
        {isConnected && address ? (
          <div className="flex gap-2 sm:gap-3 items-center">
            <Button size={"sm"} asChild className="text-xs sm:text-sm">
              <Link href={"/nft/create"}>
                Create
                <Plus className="stroke-2 sm:stroke-[3]" />
              </Link>
            </Button>
            <ProfileMenu address={address} />
          </div>
        ) : (
          <Button size={"sm"} onClick={connectToWallet} variant={"default"}>
            <Image
              src={"/metamask-icon.webp"}
              alt="Metamask Icon"
              width={20}
              height={20}
            />
            Connect Wallet
          </Button>
        )}
      </nav>
    </div>
  );
};

const ProfileMenu = ({ address }: { address: `0x${string}` }) => {
  const { disconnect } = useDisconnect();
  const router = useRouter();

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
          <AvatarFallback>0x</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>{shortedAccountAddress(address)}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => {
            router.push(`/user/${encodeText(address)}`);
          }}
        >
          <LayoutDashboard />
          Dashboard
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            router.push("/user/dashboard#my-nfts");
          }}
        >
          <AlignVerticalJustifyEnd />
          My NFTs
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            router.push("/user/dashboard#my-listings");
          }}
        >
          <List />
          My Listings
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => disconnect()}>
          <Unplug />
          Disconnect
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
export default NavbarActions;
