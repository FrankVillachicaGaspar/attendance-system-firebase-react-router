import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogOutIcon, MoreVerticalIcon } from "lucide-react";
import type { FirebaseEmployee } from "@/common/types/firebase/FirebaseEmployee.type";
import { Form } from "react-router";
import { Button } from "@/components/ui/button";
import type { FirebaseAdminUser } from "@/common/types/firebase/FIrebaseAdminUser";

interface Props {
  user: FirebaseAdminUser;
  employee: FirebaseEmployee | null;
}

export default function DashboardSidebarUserNav({ user, employee }: Props) {
  const getPartialFullName = (names: string, lastname: string) => {
    return `${names.split(" ")[0]} ${lastname.split(" ")[0]}`;
  };
  const getUserInitials = () => {
    if (employee) {
      return `${employee.names.charAt(0)} ${employee.lastname.charAt(0)}`;
    }
    if (!user.email) return "U";
    return user.email.charAt(0).toUpperCase();
  };
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg grayscale">
                <AvatarImage
                  src={
                    user.photoURL ||
                    `https://api.dicebear.com/9.x/initials/svg?seed=${getUserInitials()}`
                  }
                  alt={user.email || "User"}
                />
                <AvatarFallback className="rounded-lg">CN</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                {employee && (
                  <span className="truncate font-medium">
                    {getPartialFullName(employee.names, employee.lastname)}
                  </span>
                )}
                <span className="truncate text-xs text-muted-foreground">
                  {user.email}
                </span>
              </div>
              <MoreVerticalIcon className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side="right"
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage
                    src={
                      user.photoURL ||
                      `https://api.dicebear.com/9.x/initials/svg?seed=${getUserInitials()}`
                    }
                    alt={user.email || "User"}
                  />
                  <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  {employee && (
                    <span className="truncate font-medium">
                      {getPartialFullName(employee.names, employee.lastname)}
                    </span>
                  )}
                  <span className="truncate text-xs text-muted-foreground">
                    {user.email}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <Form method="post" action="/logout">
              <DropdownMenuItem>
                <Button
                  type="submit"
                  variant="ghost"
                  className="w-full flex justify-start gap-3"
                >
                  <LogOutIcon />
                  Cerrar sesión
                </Button>
              </DropdownMenuItem>
            </Form>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
