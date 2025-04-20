import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Briefcase, EditIcon, Plus, Trash2Icon } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { JobPositionDialog } from "@/modules/job-position/components/job-position-dialog";
import SimpleCrudTable from "@/common/components/tables/simple-crud-table";
import type { FirebaseJobPosition } from "@/common/types/firebase/FirebaseJobPosition";
import type { PaginationResponse } from "@/common/types/pagination-response.type";
import ConfirmDialog from "@/common/components/confirm-dialog";
import { useEffect, useState } from "react";
import { useFetcher } from "react-router";
import executeToast from "@/common/utils/execute-toast.util";
import type { Route } from ".react-router/types/app/routes/admin/sections/+types/department";
import { CrudIntent } from "@/common/types/crud-intent";

interface Props {
  jobPositionPaginationResponse: PaginationResponse<FirebaseJobPosition[]>;
}

export default function JobPositionTable({
  jobPositionPaginationResponse,
}: Props) {
  const [openModal, setOpenModal] = useState(false);

  const [deleteUid, setDeleteUid] = useState<string | null>(null);

  const [selectedJobPosition, setSelectedJobPosition] = useState<
    FirebaseJobPosition | undefined
  >(undefined);

  const fetcher = useFetcher();

  const fetcherData = fetcher.data as Route.ComponentProps["actionData"];

  const handleChangeOpenModal = (open: boolean) => {
    setOpenModal(open);
    if (!open) setSelectedJobPosition(undefined);
  };

  const handleEdit = (jobPosition: FirebaseJobPosition) => {
    setSelectedJobPosition(jobPosition);
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
    jobPosition: Partial<FirebaseJobPosition> | FirebaseJobPosition
  ) => {
    if (jobPosition.uid) {
      await fetcher.submit(
        {
          intent: CrudIntent.UPDATE,
          ...jobPosition,
        },
        {
          method: "post",
        }
      );
    } else {
      await fetcher.submit(
        {
          intent: CrudIntent.CREATE,
          ...jobPosition,
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
          <Briefcase size={30} />
          Puestos de Trabajo
        </CardTitle>
        <Button onClick={() => setOpenModal(true)}>
          <Plus />
          Agregar Puesto de Trabajo
        </Button>
        <JobPositionDialog
          isSubmiting={fetcher.state !== "idle"}
          open={openModal}
          onOpenChange={handleChangeOpenModal}
          title={
            selectedJobPosition ? "Editar Puesto de Trabajo" : "Agregar Puesto de Trabajo"
          }
          onSave={onSave}
          jobPosition={selectedJobPosition}
        />
      </CardHeader>
      <Separator />
      <CardContent className="flex flex-col items-end">
        <SimpleCrudTable
          title="Departamentos"
          data={jobPositionPaginationResponse.data}
          columns={[
            {
              header: "Nombre",
              cell: ({ row }) => {
                const jobPosition = row.original;
                return <p className="min-w-[250px] ">{jobPosition.name}</p>;
              },
            },
            {
              header: "Descripción",
              accessorKey: "description",
              cell: ({ row }) => {
                const jobPosition = row.original;
                return (
                  <div className="max-w-[490px]">
                    <p className="break-words whitespace-normal">
                      {jobPosition.description}
                    </p>
                  </div>
                );
              },
            },
            {
              header: "Fecha de creación",
              cell: ({ row }) => {
                const jobPosition = row.original;
                return (
                  <p className="max-w-[135px]">{jobPosition.created_at}</p>
                );
              },
            },
            {
              header: "Acciones",
              size: 100,
              cell: ({ row }) => {
                const jobPosition = row.original;
                return (
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => handleEdit(jobPosition)}
                    >
                      <EditIcon />
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setDeleteUid(jobPosition.uid)}
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
        descriptionTitle="¿Estas seguro de eliminar el puesto de trabajo?"
        descriptionText="Esta acción no se puede deshacer. Esto eliminará permanentemente el puesto de trabajo."
      />
    </Card>
  );
}
