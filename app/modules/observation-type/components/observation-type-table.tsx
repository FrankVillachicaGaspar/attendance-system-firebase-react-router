import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ClipboardList, EditIcon, Plus, Trash2Icon } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { ObservationTypeDialog } from "@/modules/observation-type/components/observation-type-dialog";
import SimpleCrudTable from "@/common/components/tables/simple-crud-table";
import type { PaginationResponse } from "@/common/types/pagination-response.type";
import ConfirmDialog from "@/common/components/confirm-dialog";
import { useEffect, useState } from "react";
import { useFetcher } from "react-router";
import executeToast from "@/common/utils/execute-toast.util";
import type { Route } from ".react-router/types/app/routes/admin/sections/+types/department";
import { CrudIntent } from "@/common/types/crud-intent";
import type { FirebaseObservationType } from "@/common/types/firebase/FirebaseObservationType";

interface Props {
  observationTypePaginationResponse: PaginationResponse<
    FirebaseObservationType[]
  >;
}

export default function ObservationTypeTable({
  observationTypePaginationResponse,
}: Props) {
  const [openModal, setOpenModal] = useState(false);

  const [deleteUid, setDeleteUid] = useState<string | null>(null);

  const [selectedObservationType, setSelectedObservationType] = useState<
    FirebaseObservationType | undefined
  >(undefined);

  const fetcher = useFetcher();

  const fetcherData = fetcher.data as Route.ComponentProps["actionData"];

  const handleChangeOpenModal = (open: boolean) => {
    setOpenModal(open);
    if (!open) setSelectedObservationType(undefined);
  };

  const handleEdit = (observationType: FirebaseObservationType) => {
    setSelectedObservationType(observationType);
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
    observationType: Partial<FirebaseObservationType> | FirebaseObservationType
  ) => {
    if (observationType.uid) {
      await fetcher.submit(
        {
          intent: CrudIntent.UPDATE,
          ...observationType,
        },
        {
          method: "post",
        }
      );
    } else {
      await fetcher.submit(
        {
          intent: CrudIntent.CREATE,
          ...observationType,
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
          <ClipboardList size={30} />
          Tipos de Observación
        </CardTitle>
        <Button onClick={() => setOpenModal(true)}>
          <Plus />
          Agregar Tipo de Observación
        </Button>
        <ObservationTypeDialog
          isSubmiting={fetcher.state !== "idle"}
          open={openModal}
          onOpenChange={handleChangeOpenModal}
          title={
            selectedObservationType
              ? "Editar Tipo de observación"
              : "Agregar Tipo de observación"
          }
          onSave={onSave}
          observationType={selectedObservationType}
        />
      </CardHeader>
      <Separator />
      <CardContent className="flex flex-col items-end">
        <SimpleCrudTable
          data={observationTypePaginationResponse.data}
          columns={[
            {
              header: "Nombre",
              cell: ({ row }) => {
                const observationType = row.original;
                return <p className="min-w-[250px] ">{observationType.name}</p>;
              },
            },
            {
              header: "Descripción",
              accessorKey: "description",
              cell: ({ row }) => {
                const observationType = row.original;
                return (
                  <div className="max-w-[490px]">
                    <p className="break-words whitespace-normal">
                      {observationType.description}
                    </p>
                  </div>
                );
              },
            },
            {
              header: "Fecha de creación",
              cell: ({ row }) => {
                const observationType = row.original;
                return (
                  <p className="max-w-[135px]">{observationType.created_at}</p>
                );
              },
            },
            {
              header: "Acciones",
              size: 100,
              cell: ({ row }) => {
                const observationType = row.original;
                return (
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => handleEdit(observationType)}
                    >
                      <EditIcon />
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setDeleteUid(observationType.uid)}
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
        descriptionTitle="¿Estas seguro de eliminar el tipo de observación?"
        descriptionText="Esta acción no se puede deshacer. Esto eliminará permanentemente el tipo de observación."
      />
    </Card>
  );
}
