import JobPositionTable from "@/modules/job-position/components/job-position-table";
import type { Route } from "./+types/job-positions";
import { getPaginationSearchParams } from "@/common/utils/pagination.utils";
import findAllJobPositionWithPagination from "@/modules/job-position/firestore/find-all-job-position-with-pagination";
import ServerSidePagination from "@/common/components/server-side-pagination";
import type { FirebaseJobPosition } from "@/common/types/firebase/FirebaseJobPosition";
import type { ToastConfig } from "@/common/types/toast-config";
import { CrudIntent } from "@/common/types/crud-intent";
import createJobPosition from "@/modules/job-position/firestore/create-job-position";
import logicDeleteJobPositionByUid from "@/modules/job-position/firestore/logic-delete-job-position-by-uid";
import updateJobPosition from "@/modules/job-position/firestore/update-job-position";

export default function JobPositions({ loaderData }: Route.ComponentProps) {
  const { jobPositionPaginationResponse } = loaderData;
  return (
    <div className="max-w-6xl mx-auto">
      <JobPositionTable
        jobPositionPaginationResponse={jobPositionPaginationResponse}
      />
      <ServerSidePagination<FirebaseJobPosition>
        paginationMetadata={jobPositionPaginationResponse}
      />
    </div>
  );
}

export async function loader({ request }: Route.LoaderArgs) {
  const { limit, skip, page } = getPaginationSearchParams(request);

  const jobPositionPaginationResponse = await findAllJobPositionWithPagination({
    limit,
    page,
    skip,
  });

  return { jobPositionPaginationResponse };
}

export async function action({
  request,
}: Route.ActionArgs): Promise<{ toast: ToastConfig }> {
  const formData = await request.formData();
  const intent = formData.get("intent") as CrudIntent;

  if (intent === CrudIntent.CREATE) {
    try {
      const jobPosition: Partial<FirebaseJobPosition> = {
        name: formData.get("name") as string,
        description: formData.get("description") as string,
      };
      await createJobPosition(jobPosition);
    } catch (error: any) {
      return {
        toast: {
          title: "Error al crear el puesto de trabajo",
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
        title: "Departamento creado exitosamente",
        description: "Departamento creado exitosamente",
        type: "success",
        closeButton: true,
        position: "top-center",
        richColors: true,
      },
    };
  }

  if (intent === CrudIntent.UPDATE) {
    try {
      const jobPosition: Partial<FirebaseJobPosition> = {
        uid: formData.get("uid") as string,
        name: formData.get("name") as string,
        description: formData.get("description") as string,
      };
      await updateJobPosition(jobPosition);
    } catch (error: any) {
      return {
        toast: {
          title: "Error al actualizar el puesto de trabajo",
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
        title: "Departamento actualizado exitosamente",
        description: "Departamento actualizado exitosamente",
        type: "success",
        closeButton: true,
        position: "top-center",
        richColors: true,
      },
    };
  }

  if (intent === CrudIntent.DELETE) {
    try {
      const jobPositionUid = formData.get("uid") as string;
      await logicDeleteJobPositionByUid(jobPositionUid);
    } catch (error: any) {
      return {
        toast: {
          title: "Error al eliminar el puesto de trabajo",
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
        title: "Departamento eliminado exitosamente",
        description: "Departamento eliminado exitosamente",
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
