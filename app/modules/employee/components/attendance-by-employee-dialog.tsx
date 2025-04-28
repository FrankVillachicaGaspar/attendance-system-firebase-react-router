"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, Table } from "lucide-react";
import { addDays, format } from "date-fns";
import { es } from "date-fns/locale";
import type { DateRange } from "react-day-picker";
import { Popover } from "@radix-ui/react-popover";
import { PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import _ from "lodash";
import { useFetcher } from "react-router";
import type { FirebaseEmployee } from "@/common/types/firebase/FirebaseEmployee.type";
import exportEmployeeAttendanceToExcel from "../utils/export-employee-attendance-to-excel";
import type { FirebaseAttendance } from "@/common/types/firebase/FirebaseAttendance";

interface Props {
  employee: FirebaseEmployee;
}

export function AttendanceByEmployeeDialog({ employee }: Props) {
  const fetcher = useFetcher<{ attendanceList: FirebaseAttendance[] }>();
  const fetcherData = fetcher.data;
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<DateRange | undefined>(undefined);

  const handleExport = async () => {
    await handleHandleAttendances();
  };

  const handleHandleAttendances = async () => {
    await fetcher.submit(
      {
        employeeUid: employee.uid ?? "",
        from: date?.from ? format(date.from, "yyyy-MM-dd") : "",
        to: date?.to ? format(date.to, "yyyy-MM-dd") : "",
      },
      { method: "post", action: "/get-attendances-by-employee" }
    );
  };

  useEffect(() => {
    if (fetcherData) {
      exportEmployeeAttendanceToExcel(fetcherData.attendanceList, {
        from: date?.from ? format(date.from, "yyyy-MM-dd") : "",
        to: date?.to ? format(date.to, "yyyy-MM-dd") : "",
      });
    }
  }, [fetcherData]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost">
          <Table className="text-green-700" />
        </Button>
      </DialogTrigger>
      <DialogContent className="">
        <DialogHeader>
          <DialogTitle>
            Exportar asistencias de {_.startCase(employee.names)}{" "}
            {_.startCase(employee.lastname)}
          </DialogTitle>
          <DialogDescription>
            Selecciona un rango de fechas para exportar sus asistencias
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label>Rango de fechas</Label>
            <div className={"grid gap-2"}>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="date"
                    variant={"outline"}
                    className={cn(
                      "w-[300px] justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon />
                    {date?.from ? (
                      date.to ? (
                        <>
                          {format(date.from, "LLL dd, y", { locale: es })} -{" "}
                          {format(date.to, "LLL dd, y", { locale: es })}
                        </>
                      ) : (
                        format(date.from, "LLL dd, y", { locale: es })
                      )
                    ) : (
                      <span>Selecciona un rango de fechas</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="range"
                    defaultMonth={date?.from}
                    selected={date}
                    onSelect={setDate}
                    numberOfMonths={2}
                    locale={es}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {date?.from && date?.to && (
            <div className="flex items-center gap-2">
              <Badge variant="outline">
                Desde: {format(date.from, "dd/MM/yyyy", { locale: es })} -
                Hasta: {format(date.to, "dd/MM/yyyy", { locale: es })}
              </Badge>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button onClick={handleExport} disabled={!date}>
            Exportar datos
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
