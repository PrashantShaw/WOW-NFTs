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
  CircleHelp,
  Plus,
  Unplug,
  User,
} from "lucide-react";
import { ThemeToggler } from "../ThemeToggler";
import Link from "next/link";
import { useAccount, useDisconnect } from "wagmi";
import Image from "next/image";
import useConnectWallet from "@/hooks/useConnectWallet";
import { shortedAccountAddress } from "@/lib/utils";
const NavbarActions = () => {
  const { isConnected, address } = useAccount();
  const { connectToWallet } = useConnectWallet();
  return (
    <div className="flex flex-1 items-center justify-end space-x-4">
      <nav className="flex items-center space-x-1">
        <ThemeToggler />
        {isConnected && address ? (
          <>
            <Link href={"/nft/create"}>
              <Button size={"sm"} className="mr-3 ml-1">
                Create
                <Plus strokeWidth={3} />
              </Button>
            </Link>
            <ProfileMenu address={address} />
          </>
        ) : (
          <>
            <Button size={"sm"} onClick={connectToWallet} variant={"default"}>
              <Image
                src={"/metamask-icon.webp"}
                alt="Metamask Icon"
                width={20}
                height={20}
              />
              Connect Wallet
            </Button>
          </>
        )}
      </nav>
    </div>
  );
};

const ProfileMenu = ({ address }: { address: `0x${string}` }) => {
  const { disconnect } = useDisconnect();
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>{shortedAccountAddress(address)}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <User />
          My Profile
        </DropdownMenuItem>
        <DropdownMenuItem>
          <AlignVerticalJustifyEnd />
          My Items
        </DropdownMenuItem>
        <DropdownMenuItem>
          <CircleHelp />
          Help
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
