import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building2Icon, EditIcon, Plus, Trash2Icon } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { DepartmentDialog } from "@/modules/department/components/department-dialog";
import SimpleCrudTable from "@/common/components/tables/simple-crud-table";
import type { FirebaseDepartment } from "@/common/types/firebase/FirebaseDepartment.type";
import type { PaginationResponse } from "@/common/types/pagination-response.type";
import ConfirmDialog from "@/common/components/confirm-dialog";
import { useEffect, useState } from "react";
import { useFetcher } from "react-router";
import executeToast from "@/common/utils/execute-toast.util";
import type { Route } from ".react-router/types/app/routes/admin/sections/+types/department";
import { CrudIntent } from "@/common/types/crud-intent";

interface Props {
  departmentPaginationResponse: PaginationResponse<FirebaseDepartment[]>;
}

export default function DepartmentTable({
  departmentPaginationResponse,
}: Props) {
  const [openModal, setOpenModal] = useState(false);

  const [deleteUid, setDeleteUid] = useState<string | null>(null);

  const [selectedDepartment, setSelectedDepartment] = useState<
    FirebaseDepartment | undefined
  >(undefined);

  const fetcher = useFetcher();

  const fetcherData = fetcher.data as Route.ComponentProps["actionData"];

  const handleChangeOpenModal = (open: boolean) => {
    setOpenModal(open);
    if (!open) setSelectedDepartment(undefined);
  };

  const handleEdit = (department: FirebaseDepartment) => {
    setSelectedDepartment(department);
    setOpenModal(true);
  };

  const handleDelete = () => {
    fetcher.submit(
      {
        intent: CrudIntent.DELETE,
        uid: deleteUid,
      },
      {
        method: "post",
      }
    );
  };

  const onSave = async (
    department: Partial<FirebaseDepartment> | FirebaseDepartment
  ) => {
    if (department.uid) {
      await fetcher.submit(
        {
          intent: CrudIntent.UPDATE,
          ...department,
        },
        {
          method: "post",
        }
      );
    } else {
      await fetcher.submit(
        {
          intent: CrudIntent.CREATE,
          ...department,
        },
        {
          method: "post",
        }
      );
    }
    handleChangeOpenModal(false);
  };

  useEffect(() => {
    if (fetcherData) {
      executeToast(fetcherData.toast);
    }
  }, [fetcherData]);
  return (
    <Card>
      <CardHeader className="flex justify-between">
        <CardTitle className="text-2xl flex gap-2 items-center">
          <Building2Icon size={30} />
          Departamentos
        </CardTitle>
        <Button onClick={() => setOpenModal(true)}>
          <Plus />
          Agregar Departamento
        </Button>
        <DepartmentDialog
          isSubmiting={fetcher.state !== "idle"}
          open={openModal}
          onOpenChange={handleChangeOpenModal}
          title={
            selectedDepartment ? "Editar Departamento" : "Agregar Departamento"
          }
          onSave={onSave}
          department={selectedDepartment}
        />
      </CardHeader>
      <Separator />
      <CardContent className="flex flex-col items-end">
        <SimpleCrudTable
          data={departmentPaginationResponse.data}
          columns={[
            {
              header: "Nombre",
              cell: ({ row }) => {
                const department = row.original;
                return <p className="min-w-[250px]">{department.name}</p>;
              },
            },
            {
              header: "Descripción",
              cell: ({ row }) => {
                const department = row.original;
                return (
                  <div className="w-[490px]">
                    <p className="break-words whitespace-normal">
                      {department.description}
                    </p>
                  </div>
                );
              },
            },
            {
              header: "Fecha de creación",
              cell: ({ row }) => {
                const department = row.original;
                return <p className="max-w-[135px]">{department.created_at}</p>;
              },
            },
            {
              header: "Acciones",
              size: 100,
              cell: ({ row }) => {
                const department = row.original;
                return (
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => handleEdit(department)}
                    >
                      <EditIcon />
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setDeleteUid(department.uid)}
                    >
                      <Trash2Icon className="text-destructive" />
                    </Button>
                  </div>
                );
              },
            },
          ]}
        />
      </CardContent>
      <ConfirmDialog
        handleConfirmAction={handleDelete}
        open={!!deleteUid}
        onOpenChange={(open) => !open && setDeleteUid(null)}
        confirmText="Eliminar"
        descriptionTitle="¿Estas seguro de eliminar el departamento?"
        descriptionText="Esta acción no se puede deshacer. Esto eliminará permanentemente el departamento."
      />
    </Card>
  );
}
