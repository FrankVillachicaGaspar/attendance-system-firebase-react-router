import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Check, Edit, Plus, Trash2, UsersIcon, X } from "lucide-react";
import EmployeeDialog from "./employee-dialog";
import { useEffect, useMemo, useState } from "react";
import type { FirebaseEmployee } from "@/common/types/firebase/FirebaseEmployee.type";
import type { EmployeeFormType } from "../schema/employee-form.schema";
import { useFetcher } from "react-router";
import type { Route } from ".react-router/types/app/routes/admin/sections/+types/employees";
import { CrudIntent } from "@/common/types/crud-intent";
import executeToast from "@/common/utils/execute-toast.util";
import type { FirebaseJobPosition } from "@/common/types/firebase/FirebaseJobPosition";
import type { FirebaseDepartment } from "@/common/types/firebase/FirebaseDepartment.type";
import type { FirebaseRole } from "@/common/types/firebase/FirebaseRole.type";
import type { PaginationResponse } from "@/common/types/pagination-response.type";
import { Button } from "@/components/ui/button";
import { type ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import SimpleCrudTable from "@/common/components/tables/simple-crud-table";
import ConfirmDialog from "@/common/components/confirm-dialog";

interface Props {
  employeePaginationResponse: PaginationResponse<FirebaseEmployee[]>;
  jobPositions: FirebaseJobPosition[];
  departments: FirebaseDepartment[];
  roles: FirebaseRole[];
}

export default function EmployeeTable({
  employeePaginationResponse,
  jobPositions,
  departments,
  roles,
}: Props) {
  const [openModal, setOpenModal] = useState(false);
  const [deletedUid, setDeletedUid] = useState<string | null>(null);
  const [selectedEmployee, setSelectedEmployee] = useState<
    FirebaseEmployee | undefined
  >(undefined);

  const fetcher = useFetcher();
  const fetcherData = fetcher.data as Route.ComponentProps["actionData"];

  const handleOpenModal = (open: boolean) => {
    if (!open) setSelectedEmployee(undefined);
    setOpenModal(open);
  };

  const handleEdit = (employee: FirebaseEmployee) => {
    setSelectedEmployee(employee);
    setOpenModal(true);
  };

  const handleDelete = () => {
    fetcher.submit(
      {
        intent: CrudIntent.DELETE,
        uid: deletedUid,
      },
      {
        method: "post",
      }
    );
  };

  const onSave = async (employee: EmployeeFormType) => {
    if (selectedEmployee) {
      await fetcher.submit(
        {
          intent: CrudIntent.UPDATE,
          uid: selectedEmployee.uid,
          ...employee,
        },
        {
          method: "post",
        }
      );
    } else {
      await fetcher.submit(
        {
          intent: CrudIntent.CREATE,
          ...employee,
        },
        {
          method: "post",
        }
      );
    }
    handleOpenModal(false);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-PE", {
      style: "currency",
      currency: "PEN",
    }).format(amount);
  };

  const columns = useMemo<ColumnDef<FirebaseEmployee>[]>(
    () => [
      {
        accessorKey: "names",
        header: "Nombres",
        cell: ({ row }) => (
          <div>
            <div className="font-medium">{row.original.names}</div>
            <div className="text-sm text-muted-foreground">
              {row.original.lastname}
            </div>
          </div>
        ),
      },
      {
        accessorKey: "department.name",
        header: "Departamento",
        cell: ({ row }) => <div>{row.original.department.name}</div>,
      },
      {
        accessorKey: "job_position.name",
        header: "Puesto",
        cell: ({ row }) => <div>{row.original.job_position.name}</div>,
      },
      {
        accessorKey: "dni",
        header: "DNI",
      },
      {
        accessorKey: "salary",
        header: "Salario",
        cell: ({ row }) => (
          <div className="text-right">
            {formatCurrency(row.original.salary)}
          </div>
        ),
      },
      {
        accessorKey: "is_active",
        header: "Estado",
        cell: ({ row }) => (
          <div className="flex justify-center">
            {row.original.is_active ? (
              <Badge
                variant="outline"
                className="bg-green-50 text-green-700 border-green-200"
              >
                <Check className="mr-1 h-3 w-3" /> Activo
              </Badge>
            ) : (
              <Badge
                variant="outline"
                className="bg-red-50 text-red-700 border-red-200"
              >
                <X className="mr-1 h-3 w-3" /> Inactivo
              </Badge>
            )}
          </div>
        ),
      },
      {
        id: "actions",
        cell: ({ row }) => (
          <div className="flex justify-end gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleEdit(row.original)}
            >
              <Edit className="h-4 w-4" />
              <span className="sr-only">Editar</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setDeletedUid(row.original.uid)}
            >
              <Trash2 className="h-4 w-4 text-destructive" />
              <span className="sr-only">Eliminar</span>
            </Button>
          </div>
        ),
      },
    ],
    []
  );

  useEffect(() => {
    if (fetcherData) {
      executeToast(fetcherData.toast);
    }
  }, [fetcherData]);

  return (
    <Card>
      <CardHeader className="flex justify-between">
        <CardTitle className="text-2xl flex gap-2 items-center">
          <div className="flex gap-2">
            <UsersIcon size={30} />
            <span className="text-2xl">Employees</span>
          </div>
        </CardTitle>
        <Button onClick={() => setOpenModal(true)}>
          <Plus />
          Agregar Empleado
        </Button>
        <EmployeeDialog
          open={openModal}
          onOpenChange={handleOpenModal}
          onSave={onSave}
          employee={selectedEmployee}
          title={selectedEmployee ? "Editar empleado" : "Agregar empleado"}
          isSubmiting={fetcher.state !== "idle"}
          jobPositions={jobPositions}
          departments={departments}
          roles={roles}
        />
      </CardHeader>
      <Separator />
      <CardContent>
        <SimpleCrudTable
          data={employeePaginationResponse.data}
          columns={columns}
        />
      </CardContent>
      <ConfirmDialog
        handleConfirmAction={handleDelete}
        open={!!deletedUid}
        onOpenChange={(open) => !open && setDeletedUid(null)}
        confirmText="Eliminar"
        descriptionTitle="¿Estas seguro de eliminar el empleado?"
        descriptionText="Esta acción no se puede deshacer. Esto eliminará permanentemente el empleado."
      />
    </Card>
  );
}
