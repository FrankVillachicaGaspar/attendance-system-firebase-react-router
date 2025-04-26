import ObservationTypeTable from "@/modules/observation-type/components/observation-type-table";
import type { Route } from "./+types/observation-type";
import ServerSidePagination from "@/common/components/server-side-pagination";
import type { FirebaseObservationType } from "@/common/types/firebase/FirebaseObservationType";
import { getPaginationSearchParams } from "@/common/utils/pagination.utils";
import findAllObservationTypeWithPagination from "@/modules/observation-type/firestore/find-all-observation-type-with-pagination";
import type { ToastConfig } from "@/common/types/toast-config";
import { CrudIntent } from "@/common/types/crud-intent";
import logicDeleteObservationTypeByUid from "@/modules/observation-type/firestore/logic-delete-observation-type-by-uid";
import updateObservationType from "@/modules/observation-type/firestore/update-observation-type";
import createObservationType from "@/modules/observation-type/firestore/create-observation-type";

export default function ObservationType({ loaderData }: Route.ComponentProps) {
  const { observationTypePaginationResponse } = loaderData;
  return (
    <div className="max-w-6xl mx-auto">
      <ObservationTypeTable
        observationTypePaginationResponse={observationTypePaginationResponse}
      />
      <ServerSidePagination<FirebaseObservationType>
        paginationMetadata={observationTypePaginationResponse}
      />
    </div>
  );
}

export async function loader({ request }: Route.LoaderArgs) {
  const { limit, skip, page } = getPaginationSearchParams(request);

  const observationTypePaginationResponse =
    await findAllObservationTypeWithPagination({
      limit,
      page,
      skip,
    });

  return { observationTypePaginationResponse };
}

export async function action({
  request,
}: Route.ActionArgs): Promise<{ toast: ToastConfig }> {
  const formData = await request.formData();
  const intent = formData.get("intent") as CrudIntent;

  if (intent === CrudIntent.CREATE) {
    try {
      const observationType: Partial<FirebaseObservationType> = {
        name: formData.get("name") as string,
        description: formData.get("description") as string,
      };
      await createObservationType(observationType);
    } catch (error: any) {
      return {
        toast: {
          title: "Error al crear el tipo de observación",
          description: error.message,
          type: "error",
          closeButton: true,
          position: "top-center",
          richColors: true,
        },
      };
    }
    return {
      toast: {
        title: "Tipo de observación creado exitosamente",
        description: "Tipo de observación creado exitosamente",
        type: "success",
        closeButton: true,
        position: "top-center",
        richColors: true,
      },
    };
  }

  if (intent === CrudIntent.UPDATE) {
    try {
      const observationType: Partial<FirebaseObservationType> = {
        uid: formData.get("uid") as string,
        name: formData.get("name") as string,
        description: formData.get("description") as string,
      };
      await updateObservationType(observationType);
    } catch (error: any) {
      return {
        toast: {
          title: "Error al actualizar el tipo de observación",
          description: error.message,
          type: "error",
          closeButton: true,
          position: "top-center",
          richColors: true,
        },
      };
    }
    return {
      toast: {
        title: "Tipo de observación actualizado exitosamente",
        description: "Tipo de observación actualizado exitosamente",
        type: "success",
        closeButton: true,
        position: "top-center",
        richColors: true,
      },
    };
  }

  if (intent === CrudIntent.DELETE) {
    try {
      const observationTypeUid = formData.get("uid") as string;
      await logicDeleteObservationTypeByUid(observationTypeUid);
    } catch (error: any) {
      return {
        toast: {
          title: "Error al eliminar el tipo de observación",
          description: error.message,
          type: "error",
          closeButton: true,
          position: "top-center",
          richColors: true,
        },
      };
    }
    return {
      toast: {
        title: "Tipo de observación eliminado exitosamente",
        description: "Tipo de observación eliminado exitosamente",
        type: "success",
        closeButton: true,
        position: "top-center",
        richColors: true,
      },
    };
  }

  return {
    toast: {
      title: "Error desconocido",
      description: "Ocurrió un error al realizar la acción",
      type: "error",
      closeButton: true,
      position: "top-center",
      richColors: true,
    },
  };
}
