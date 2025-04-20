import {
  type RouteConfig,
  index,
  prefix,
  route,
} from "@react-router/dev/routes";
import { layout } from "@react-router/dev/routes";

export default [
  index("routes/login.tsx"),
  ...prefix("admin", [
    layout("routes/admin/admin-layout.tsx", [
      index("routes/admin/index.tsx"),
      route("dashboard", "routes/admin/sections/dashboard.tsx"),
      route("attendance", "routes/admin/sections/attendance.tsx"),
      route("employees", "routes/admin/sections/employees.tsx"),
      route("job-positions", "routes/admin/sections/job-positions.tsx"),
      route("observation-types", "routes/admin/sections/observation-type.tsx"),
      route("departments", "routes/admin/sections/department.tsx"),
    ]),
  ]),
  route("logout", "routes/logout.tsx"),
  route("login-server", "routes/login-server.tsx"),
  route("logout-server", "routes/logout-server.tsx"),
] satisfies RouteConfig;
