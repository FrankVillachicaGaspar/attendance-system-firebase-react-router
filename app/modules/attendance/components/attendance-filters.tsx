import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { DateTimePicker } from "@/components/ui/datetime-picker";
import { FilterIcon } from "lucide-react";
import { useNavigate, useLocation } from "react-router";
import { format } from "date-fns";

interface Props {
  initialDate: Date | null;
}

export default function AttendanceFilters({ initialDate }: Props) {
  const navigate = useNavigate();
  const location = useLocation();

  const [date, setDate] = useState<Date>(initialDate ?? new Date());
  const [dni, setDni] = useState<string>("");

  const handleSelectDate = (newDay: Date | undefined) => {
    console.log(newDay);
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

  return (
    <Card>
      <CardContent>
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
              granularity="day"
              displayFormat={{ hour24: "dd 'de' MMMM 'del' yyyy" }}
              placeholder="Seleccione la fecha"
              className="min-w-40"
              value={date}
              onChange={handleSelectDate}
            />
          </div>
          <div className="mt-auto">
            <Button onClick={handleFilter}>
              <FilterIcon />
              Filtrar
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
