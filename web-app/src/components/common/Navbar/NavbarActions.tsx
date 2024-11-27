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
  Bell,
  CircleHelp,
  Unplug,
  User,
} from "lucide-react";
import { ThemeToggler } from "../ThemeToggler";
import { SearchModal } from "../SearchModal";
const NavbarActions = () => {
  return (
    <div className="flex flex-1 items-center justify-end space-x-4">
      <SearchModal />
      <nav className="flex items-center space-x-1">
        <ThemeToggler />
        {/* TODO: add connect wallet button for non connected users */}
        {/* Notification */}
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <Bell className="h-4 w-4" />
              <span className="sr-only">Notifications</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Billing</DropdownMenuItem>
            <DropdownMenuItem>Team</DropdownMenuItem>
            <DropdownMenuItem>Subscription</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        {/* Avatar */}
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Username here</DropdownMenuLabel>
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
            <DropdownMenuItem>
              <Unplug />
              Disconnect
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </nav>
    </div>
  );
};

export default NavbarActions;
