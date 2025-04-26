import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { FilterIcon, Table } from "lucide-react";
import { useNavigate, useLocation } from "react-router";
import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import { DateTimePicker } from "@/components/ui/date-time-picker";

interface Props {
  initialDate: Date | null;
  handleExportToExcel: () => void;
}

export default function AttendanceFilters({
  initialDate,
  handleExportToExcel,
}: Props) {
  const navigate = useNavigate();
  const location = useLocation();

  const [date, setDate] = useState<Date>(
    parseISO(initialDate?.toISOString() ?? new Date().toISOString()) ??
      new Date()
  );
  const [dni, setDni] = useState<string>("");

  const handleSelectDate = (newDay: Date | undefined) => {
    if (!newDay) return;
    setDate(newDay);
  };

  const handleChangeDni = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDni(e.target.value);
  };

  const handleFilter = () => {
    const searchParams = new URLSearchParams(location.search);

    if (date) {
      searchParams.set("date", format(date, "yyyy-MM-dd"));
    }

    if (dni?.length) {
      searchParams.set("dni", dni);
    } else {
      searchParams.delete("dni");
    }

    navigate(`${location.pathname}?${searchParams.toString()}`);
  };

  useEffect(() => {
    setDate(initialDate ?? new Date());
  }, [initialDate]);

  return (
    <Card>
      <CardContent className="flex flex-wrap gap-4 items-end justify-between">
        <div className="flex flex-wrap gap-4">
          <div>
            <Label className="mb-2" htmlFor="dni">
              DNI
            </Label>
            <Input
              autoComplete="off"
              type="text"
              name="dni"
              id="dni"
              className="w-full"
              placeholder="Ingrese el DNI del empleado"
              value={dni}
              onChange={handleChangeDni}
            />
          </div>
          <div className="mt-auto">
            <Label className="mb-2" htmlFor="date">
              Fecha
            </Label>
            <DateTimePicker
              displayFormat="dd 'de' MMMM 'del' yyyy"
              date={date}
              setDate={handleSelectDate}
              locale={es}
              hideTime
              lessThanToday
            />
          </div>
          <div className="mt-auto">
            <Button onClick={handleFilter}>
              <FilterIcon />
              Filtrar
            </Button>
          </div>
        </div>
        <div>
          <Button
            className="bg-green-600 hover:bg-green-700"
            onClick={handleExportToExcel}
          >
            <Table className="mr-2" />
            Exportar a Excel
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
