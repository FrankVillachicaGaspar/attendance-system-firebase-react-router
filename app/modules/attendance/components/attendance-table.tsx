import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Edit, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { FirebaseDepartment } from "@/common/types/firebase/FirebaseDepartment.type";
import { useEffect, useState } from "react";
import AttendanceDialog from "./attendance-dialog";
import { Label } from "@/components/ui/label";
import type { FirebaseAttendance } from "@/common/types/firebase/FirebaseAttendance";
import SimpleCrudTable from "@/common/components/tables/simple-crud-table";
import type { FirebaseObservationType } from "@/common/types/firebase/FirebaseObservationType";
import { useFetcher, useLocation, useNavigate } from "react-router";
import type { Route } from ".react-router/types/app/routes/admin/sections/+types/attendance";
import executeToastList from "@/common/utils/execute-toast-list.util";
import { AttendanceIntent } from "../enums/attendance-intents.enum";
import PulseLoader from "react-spinners/PulseLoader";
import { format, parseISO } from "date-fns";
import { SearchableSelect } from "@/components/ui/search-input-select";
import _ from "lodash";
import { es } from "date-fns/locale";

interface AttendanceTableProps {
  date: string;
  attendance: FirebaseAttendance[];
  departments: FirebaseDepartment[];
  observationTypes: FirebaseObservationType[];
}

export function AttendanceTable({
  date,
  attendance,
  departments,
  observationTypes,
}: AttendanceTableProps) {
  const [tableDate, setTableDate] = useState<string | null>(null);
  const [attendanceList, setAttendanceList] = useState<FirebaseAttendance[]>(
    []
  );
  const [openModal, setOpenModal] = useState(false);
  const [selectedAttendance, setSelectedAttendance] = useState<
    FirebaseAttendance | undefined
  >(undefined);
  const navigate = useNavigate();
  const location = useLocation();
  const fetcher = useFetcher();
  const fetcherData = fetcher.data as Route.ComponentProps["actionData"];

  const handleOpenModal = (open: boolean) => {
    if (!open) {
      setSelectedAttendance(undefined);
    }
    setOpenModal(open);
  };

  const getDepartmentFilter = () => {
    const searchParams = new URLSearchParams(location.search);
    return searchParams.get("department") ?? departments[0]?.uid;
  };

  const [departmentFilter, setDepartmentFilter] = useState<string | undefined>(
    getDepartmentFilter()
  );

  const handleSetDepartmentFilter = (value: string) => {
    const searchParams = new URLSearchParams(location.search);
    searchParams.set("department", value);
    setDepartmentFilter(value);
    navigate(`${location.pathname}?${searchParams.toString()}`);
  };

  const handleGenerateAttendances = () => {
    fetcher.submit(
      {
        intent: AttendanceIntent.GENERATE_ATTENDANCES,
        department: departmentFilter ?? "",
      },
      { method: "post" }
    );
  };

  useEffect(() => {
    if (fetcherData) {
      executeToastList(fetcherData.toastList);
    }
  }, [fetcherData]);

  useEffect(() => {
    setDepartmentFilter(getDepartmentFilter());
  }, [attendance]);

  useEffect(() => {
    setAttendanceList(attendance);
  }, [attendance]);

  useEffect(() => {
    const dateParam = parseISO(date);
    if (date.length > 0) {
      setTableDate(format(dateParam, "dd 'de' MMMM 'del' yyyy", { locale: es }));
    }
  }, [date]);

  return (
    <Card>
      <CardHeader className="flex flex-wrap flex-row items-center justify-between gap-4 md:gap-0">
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Control de Asistencia {tableDate ? `del ${tableDate}` : ""}
        </CardTitle>
        <div className="flex items-end gap-2">
          <div className="flex flex-col gap-2">
            <Label>Departamento:</Label>
            <SearchableSelect
              options={departments.map((department) => ({
                value: department.uid,
                label: department.name,
              }))}
              placeholder="Seleccionar departamento"
              defaultValue={departmentFilter || ""}
              value={departmentFilter || ""}
              onChange={handleSetDepartmentFilter}
              label="departamento"
            />
          </div>
          <Button
            onClick={handleGenerateAttendances}
            disabled={fetcher.state !== "idle"}
            className="min-w-56"
          >
            {fetcher.state === "idle" ? (
              "Generar asistencias del día"
            ) : (
              <PulseLoader size={10} color="#fff" />
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <SimpleCrudTable
          data={attendanceList}
          columns={[
            {
              header: "Empleado",
              cell: ({ row }) => (
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <div className="flex flex-col gap-1">
                    <div className="font-medium text-md">
                      {_.startCase(row.original.employee.names)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {_.startCase(row.original.employee.lastname)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      DNI: {row.original.employee.dni}
                    </div>
                  </div>
                </div>
              ),
            },
            {
              header: "Departamento",
              cell: ({ row }) => (
                <div className="flex items-center gap-2">
                  <div>{row.original.employee.department.name}</div>
                </div>
              ),
            },
            {
              header: "Primera Entrada",
              cell: ({ row }) => (
                <div className="flex items-center gap-2">
                  <div>
                    {row.original.first_check_in_time ? (
                      format(
                        new Date(row.original.first_check_in_time),
                        "HH:mm"
                      )
                    ) : (
                      <span className="text-muted-foreground">
                        No registrado
                      </span>
                    )}
                  </div>
                </div>
              ),
            },
            {
              header: "Primera Salida",
              cell: ({ row }) => (
                <div className="flex items-center gap-2">
                  <div>
                    {row.original.first_check_out_time ? (
                      format(
                        new Date(row.original.first_check_out_time),
                        "HH:mm"
                      )
                    ) : (
                      <span className="text-muted-foreground">
                        No registrado
                      </span>
                    )}
                  </div>
                </div>
              ),
            },
            {
              header: "Segunda Entrada",
              cell: ({ row }) => (
                <div className="flex items-center gap-2">
                  <div>
                    {row.original.second_check_in_time ? (
                      format(
                        new Date(row.original.second_check_in_time),
                        "HH:mm"
                      )
                    ) : (
                      <span className="text-muted-foreground">
                        No registrado
                      </span>
                    )}
                  </div>
                </div>
              ),
            },
            {
              header: "Segunda Salida",
              cell: ({ row }) => (
                <div className="flex items-center gap-2">
                  <div>
                    {row.original.second_check_out_time ? (
                      format(
                        new Date(row.original.second_check_out_time),
                        "HH:mm"
                      )
                    ) : (
                      <span className="text-muted-foreground">
                        No registrado
                      </span>
                    )}
                  </div>
                </div>
              ),
            },
            {
              header: "Horas Trabajadas",
              cell: ({ row }) =>
                row.original.work_hours ? (
                  <p className="w-full">
                    {row.original.work_hours}{" "}
                    {row.original.work_hours > 1 ? "horas" : "hora"}
                  </p>
                ) : (
                  <p className="w-full text-muted-foreground">Por calcular</p>
                ),
            },
            {
              header: "Horas Extras",
              cell: ({ row }) =>
                row.original.overtime ? (
                  <p className="w-full">
                    {row.original.overtime}{" "}
                    {row.original.overtime > 1 ? "horas" : "hora"}
                  </p>
                ) : (
                  <p className="w-full text-muted-foreground">
                    {row.original.work_hours === 8
                      ? "Sin horas extras"
                      : "Por calcular"}
                  </p>
                ),
            },
            {
              header: "Observación",
              cell: ({ row }) => (
                <div className="flex items-center gap-2">
                  <div>
                    {row.original.observation_type ? (
                      row.original.observation_type.name
                    ) : (
                      <span className="text-muted-foreground">Ninguna</span>
                    )}
                  </div>
                </div>
              ),
            },
            {
              header: "Acciones",
              cell: ({ row }) => (
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setSelectedAttendance(row.original);
                      setOpenModal(true);
                    }}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              ),
            },
          ]}
        />
      </CardContent>
      <AttendanceDialog
        open={openModal}
        onOpenChange={handleOpenModal}
        attendance={selectedAttendance}
        observationTypes={observationTypes}
      />
    </Card>
  );
}
