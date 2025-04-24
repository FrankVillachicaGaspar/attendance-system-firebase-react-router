export default function getAllAttendanceFilters(request: Request) {
  const url = new URL(request.url);
  const dni = url.searchParams.get("dni");
  const date = url.searchParams.get("date");
  const department = url.searchParams.get("department");
  return { dni, date, department };
}
