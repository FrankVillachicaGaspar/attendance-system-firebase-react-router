import type { FirebaseDepartment } from "@/common/types/firebase/FirebaseDepartment.type";
import { Label } from "@/components/ui/label";
import { SearchableSelect } from "@/components/ui/search-input-select";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";

interface Props {
  departments: FirebaseDepartment[];
}
export default function EmployeeDepartmentFilters({ departments }: Props) {
  const [department, setDepartment] = useState<string>("Todos");
  const navigate = useNavigate();
  const location = useLocation();

  const handleFilter = () => {
    const searchParams = new URLSearchParams(location.search);
    searchParams.set("department", department);
    navigate(`${location.pathname}?${searchParams.toString()}`);
  };

  useEffect(() => {
    handleFilter();
  }, [department]);

  return (
    <div className="flex flex-col gap-2 min-w-60 w-full md:max-w-fit">
      <Label>Departamento:</Label>
      <SearchableSelect
        options={[
          {
            value: "Todos",
            label: "Todos",
          },
          ...departments.map((department) => ({
            value: department.uid,
            label: department.name,
          })),
        ]}
        value={department}
        onChange={setDepartment}
        placeholder="Seleccionar departamento"
      />
    </div>
  );
}
