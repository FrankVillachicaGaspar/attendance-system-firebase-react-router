import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Clock, User } from "lucide-react";
import type { Attendance } from "../types/attendance";
import { ObservationDialog } from "./observation-dialog";

interface AttendanceTableProps {
  attendance: Attendance[];
}

export function AttendanceTable({ attendance }: AttendanceTableProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Control de Asistencia
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Empleado</TableHead>
              <TableHead>Primera Entrada</TableHead>
              <TableHead>Primera Salida</TableHead>
              <TableHead>Segunda Entrada</TableHead>
              <TableHead>Segunda Salida</TableHead>
              <TableHead className="w-[100px]">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {attendance.map((record) => (
              <TableRow key={record.id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="font-medium">
                        {record.names} {record.lastname}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        DNI: {record.dni}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Input
                    type="datetime-local"
                    defaultValue={record.first_check_in_time}
                    className="w-44"
                  />
                </TableCell>
                <TableCell>
                  <Input
                    type="datetime-local"
                    defaultValue={record.first_check_out_time}
                    className="w-44"
                  />
                </TableCell>
                <TableCell>
                  <Input
                    type="datetime-local"
                    defaultValue={record.second_check_in_time}
                    className="w-44"
                  />
                </TableCell>
                <TableCell>
                  <Input
                    type="datetime-local"
                    defaultValue={record.second_check_out_time}
                    className="w-44"
                  />
                </TableCell>
                <TableCell>
                  <ObservationDialog
                    observation_type={record.observation_type}
                    observation={record.observation}
                    employeeName={`${record.names} ${record.lastname}`}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
