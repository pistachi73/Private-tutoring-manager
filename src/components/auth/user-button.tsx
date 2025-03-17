"use client";
import { Home, LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

import { Menu } from "@/components/ui/menu";
import { UserAvatar } from "@/components/ui/user-avatar";
import { useCurrentUser } from "@/hooks/use-current-user";

export const UserButton = () => {
  const user = useCurrentUser();

  return (
    <Menu>
      <Menu.Trigger>
        <UserAvatar
          userImage={"https://avatar.iran.liara.run/public"}
          userName={user?.name}
          size="extra-large"
        />
      </Menu.Trigger>
      <Menu.Content placement="bottom end" popoverClassName="w-[300px]">
        <Menu.Header>
          <div className="flex flex-row gap-3 items-center">
            <UserAvatar
              userImage={user?.image}
              userName={user?.name}
              size="large"
            />
            <div className="overflow-hidden">
              <p className="text-md font-medium">{user?.name}</p>
              <p className="text-text-sub text-sm truncate font-normal">
                {user?.email}
              </p>
            </div>
          </div>
        </Menu.Header>
        <Menu.Separator />
        <Menu.Item href="/account">
          <Home className="h-5 w-5 mr-2" />
          Account
        </Menu.Item>
        <Menu.Separator />
        <Menu.Item onAction={() => signOut({ redirectTo: "/" })}>
          <LogOut className="h-5 w-5 mr-2" />
          Logout
        </Menu.Item>
      </Menu.Content>
    </Menu>
  );
};
