import AttendanceFilters from "@/modules/attendance/components/attendance-filters";
import { AttendanceTable } from "@/modules/attendance/components/attendance-table";
import findAllDepartment from "@/modules/department/firestore/find-all-department";
import type { Route } from "./+types/attendance";
import findAllAttendanceWithFilters, {
  type FindaAllAttendanceFilters,
} from "@/modules/attendance/firestore/find-all-attendance-with-filters";
import findAllObservationType from "@/modules/observation-type/firestore/find-all-observation-type";
import getAllAttendanceFilters from "@/modules/attendance/utils/get-attendance-filters";
import { format, parse } from "date-fns";
import { AttendanceIntent } from "@/modules/attendance/enums/attendance-intents.enum";
import type { ToastConfig } from "@/common/types/toast-config";
import generateAttendanceByDepartment from "@/modules/attendance/firestore/generate-attendance-by-department";
import parseAttendanceForm from "@/modules/attendance/utils/parse-attendance-form";
import updateAttendance from "@/modules/attendance/firestore/update-attendance";
import exportToExcel from "@/modules/attendance/utils/export-excel";

export default function Attendance({ loaderData }: Route.ComponentProps) {
  const { departmentList, attendanceList, observationTypes, filters } =
    loaderData;

  const handleExportToExcel = () => {
    exportToExcel(attendanceList);
  };

  return (
    <div className="flex flex-col gap-3">
      <AttendanceFilters
        initialDate={filters.date}
        handleExportToExcel={handleExportToExcel}
      />
      <AttendanceTable
        attendance={attendanceList}
        departments={departmentList}
        observationTypes={observationTypes}
      />
    </div>
  );
}

export async function loader({ request }: Route.LoaderArgs) {
  const attendanceFilters = getAllAttendanceFilters(request);

  const departmentList = await findAllDepartment();

  const filters: FindaAllAttendanceFilters = {
    dni: attendanceFilters.dni,
    date: attendanceFilters.date?.length
      ? parse(attendanceFilters.date, "yyyy-MM-dd", new Date())
      : new Date(),
    department: attendanceFilters.department ?? departmentList[0].uid,
  };

  const observationTypes = await findAllObservationType();
  const attendanceList = await findAllAttendanceWithFilters(filters);

  return {
    filters,
    departmentList,
    attendanceList,
    observationTypes,
  };
}

export async function action({ request }: Route.ActionArgs) {
  const toastList: ToastConfig[] = [];
  const formData = await request.formData();
  const intent = formData.get("intent") as AttendanceIntent;

  if (intent === AttendanceIntent.GENERATE_ATTENDANCES) {
    const departmentUid = formData.get("department") as string;
    const generateAttendanceCount = await generateAttendanceByDepartment(
      departmentUid
    );

    console.log(generateAttendanceCount);
    if (generateAttendanceCount > 1) {
      toastList.push({
        type: "success",
        title: "Generación de asistencias",
        description: `Se creó la lista de asistencia para todos los empleados correctamente`,
        position: "top-right",
        richColors: true,
      });
    } else if (generateAttendanceCount === 1) {
      toastList.push({
        type: "success",
        title: "Generación de asistencias",
        description: `Lista de asistencias actualizada`,
        position: "top-right",
        richColors: true,
      });
    } else {
      toastList.push({
        type: "info",
        title: "Generación de asistencias",
        description: `Las asistencias ya fueron generadas.`,
        position: "top-right",
        richColors: true,
      });
    }
  }

  if (intent == AttendanceIntent.UPDATE_ATTENDANCE) {
    const attendanceUid = formData.get("uid") as string;
    const attendanceForm = parseAttendanceForm(formData);
    const updateAttendanceResult = await updateAttendance(
      attendanceUid,
      attendanceForm
    );
    if (updateAttendanceResult) {
      toastList.push({
        type: "success",
        title: "Actualización de asistencia",
        description: `Asistencia actualizada correctamente`,
        position: "top-right",
        richColors: true,
      });
    } else {
      toastList.push({
        type: "error",
        title: "Actualización de asistencia",
        description: `Error al actualizar la asistencia`,
        position: "top-right",
        richColors: true,
      });
    }
  }

  return { toastList };
}
