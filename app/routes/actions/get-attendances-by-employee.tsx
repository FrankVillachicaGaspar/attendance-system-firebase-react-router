import findAttendanceByEmployeeAndRangeDate from "@/modules/employee/firestore/find-attendance-by-employee-and-range-date";
import type { Route } from ".react-router/types/app/routes/actions/+types/get-attendances-by-employee";
import type { FirebaseAttendance } from "@/common/types/firebase/FirebaseAttendance";

export async function action({ request }: Route.ActionArgs) {
  console.log("get-attendances-by-employee-and-range-date");
  const formData = await request.formData();

  const employeeUid = formData.get("employeeUid") as string;
  const from = formData.get("from") as string;
  const to = formData.get("to") as string;

  if (!employeeUid || !from || !to) {
    return Response.json(
      { error: "Employee UID, from and to are required" },
      { status: 400 }
    );
  }
  const attendanceList = await findAttendanceByEmployeeAndRangeDate(
    employeeUid,
    {
      from,
      to,
    }
  );

  return Response.json({
    attendanceList,
  });
}
