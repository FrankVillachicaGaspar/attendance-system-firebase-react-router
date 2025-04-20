import {
  Briefcase,
  Building2Icon,
  CalendarCheck,
  ClipboardList,
  LayoutDashboardIcon,
  Users,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import DashboardSidebarUserNav from "./dashboard-sidebar-user-nav";
import type { FirebaseEmployee } from "@/common/types/firebase/FirebaseEmployee.type";
import type { FirebaseAdminUser } from "@/common/types/firebase/FIrebaseAdminUser";
import { Link } from "react-router";

interface Props {
  user: FirebaseAdminUser;
  employee: FirebaseEmployee | null;
}

export default function DashboardSidebar({ user, employee }: Props) {
  return (
    <Sidebar>
      <SidebarHeader className="py-3">
        <img src="/logos/with-text.webp" className="w-50 mx-auto" />
      </SidebarHeader>

      <SidebarSeparator className="ml-[-1px]" />

      <SidebarContent>
        <SidebarGroup className="mt-5">
          <SidebarGroupLabel>Inicio</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Empleados">
                  <Link to="/admin/dashboard">
                    <LayoutDashboardIcon className="h-4 w-4" />
                    <span>Dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Usuarios">
                  <Link to="/admin/attendance">
                    <CalendarCheck className="h-4 w-4" />
                    <span>Asistencias</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Mantenimiento</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Empleados">
                  <Link to="/admin/employees">
                    <Users className="h-4 w-4" />
                    <span>Empleados</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Departamentos">
                  <Link to="/admin/departments">
                    <Building2Icon className="h-4 w-4" />
                    <span>Departamentos</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Puestos de trabajo">
                  <Link to="/admin/job-positions">
                    <Briefcase className="h-4 w-4" />
                    <span>Puestos de trabajo</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Tipos de observación">
                  <Link to="/admin/observation-types">
                    <ClipboardList className="h-4 w-4" />
                    <span>Tipos de observación</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarSeparator />
      <SidebarFooter className="p-4">
        <DashboardSidebarUserNav user={user} employee={employee} />
      </SidebarFooter>
    </Sidebar>
  );
}
