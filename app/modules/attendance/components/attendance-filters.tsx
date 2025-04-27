import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { FilterIcon, Table } from "lucide-react";
import { useNavigate, useLocation, useNavigation } from "react-router";
import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import { DateTimePicker } from "@/components/ui/date-time-picker";
import PulseLoader from "react-spinners/PulseLoader";

interface Props {
  handleExportToExcel: () => void;
}

export default function AttendanceFilters({
  handleExportToExcel,
}: Props) {
  const navigate = useNavigate();
  const location = useLocation();
  const navigation = useNavigation();

  const [date, setDate] = useState<Date | null>(null);
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

  const handleDateFormSearchParams = () => {
    const searchParams = new URLSearchParams(location.search);
    const date = searchParams.get("date");
    if (date) {
      console.log("Attendance Filters - date", date);
      const dateParsed = parseISO(date);
      console.log("Attendance Filters - dateParsed", dateParsed);
      setDate(dateParsed);
    } else {
      setDate(new Date());
    }
  };

  useEffect(() => {
    handleDateFormSearchParams();
  }, [location.search]);

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
              date={date ?? undefined}
              setDate={handleSelectDate}
              locale={es}
              hideTime
              lessThanToday
            />
          </div>
          <div className="mt-auto">
            <Button
              onClick={handleFilter}
              disabled={navigation.state === "loading"}
            >
              <FilterIcon />
              {navigation.state === "loading" ? (
                <PulseLoader size={10} color="#fff" />
              ) : (
                <>Filtrar</>
              )}
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
