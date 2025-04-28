import AttendanceFilters from "@/modules/attendance/components/attendance-filters";
import { AttendanceTable } from "@/modules/attendance/components/attendance-table";
import findAllDepartment from "@/modules/department/firestore/find-all-department";
import type { Route } from "./+types/attendance";
import findAllAttendanceWithFilters, {
  type FindaAllAttendanceFilters,
} from "@/modules/attendance/firestore/find-all-attendance-with-filters";
import findAllObservationType from "@/modules/observation-type/firestore/find-all-observation-type";
import getAllAttendanceFilters from "@/modules/attendance/utils/get-attendance-filters";
import { format, parseISO } from "date-fns";
import { AttendanceIntent } from "@/modules/attendance/enums/attendance-intents.enum";
import type { ToastConfig } from "@/common/types/toast-config";
import generateAttendanceByDepartment from "@/modules/attendance/firestore/generate-attendance-by-department";
import parseAttendanceForm from "@/modules/attendance/utils/parse-attendance-form";
import updateAttendance from "@/modules/attendance/firestore/update-attendance";
import exportToExcel from "@/modules/attendance/utils/export-excel";
import type { FirebaseAttendance } from "@/common/types/firebase/FirebaseAttendance";
import { useNavigate } from "react-router";
import { useEffect } from "react";

export default function Attendance({ loaderData }: Route.ComponentProps) {
  const navigate = useNavigate();
  const { departmentList, attendanceList, observationTypes, filters } =
    loaderData;

  const handleDateFromSearchParams = () => {
    const searchParams = new URLSearchParams(location.search);
    return searchParams.get("date") ?? null;
  };
  const handleExportToExcel = () => {
    console.log(handleDateFromSearchParams());
    exportToExcel(attendanceList, handleDateFromSearchParams() ?? "");
  };

  useEffect(() => {
    const date = handleDateFromSearchParams();
    if (!date) {
      navigate(`?date=${format(new Date(), "yyyy-MM-dd")}`);
    }
  }, [filters.date]);

  return (
    <div className="flex flex-col gap-3">
      <AttendanceFilters handleExportToExcel={handleExportToExcel} />

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

  let attendanceList: FirebaseAttendance[] = [];
  const departmentList = await findAllDepartment();

  const filters: FindaAllAttendanceFilters = {
    dni: attendanceFilters.dni,
    date: attendanceFilters.date,
    department: attendanceFilters.department ?? departmentList[0].uid,
  };

  const observationTypes = await findAllObservationType();

  if (filters.date) {
    attendanceList = await findAllAttendanceWithFilters(filters);
  }

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
  const url = new URL(request.url);
  const date = url.searchParams.get("date") as string;

  if (intent === AttendanceIntent.GENERATE_ATTENDANCES) {
    const departmentUid = formData.get("department") as string;
    const generateAttendanceCount = await generateAttendanceByDepartment(
      departmentUid,
      date
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
