import { Button } from "@/components/ui/button";
import { AttendanceTable } from "@/modules/attendance/components/attendance-table";
import { mockAttendance } from "@/modules/attendance/mock/attendance.mock";

export default function Attendance() {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <Button>Generar asistencias del día</Button>
      </div>
      <AttendanceTable attendance={mockAttendance} />
    </div>
  );
}
