import findAllDepartmentWithPagination from "@/modules/department/firestore/find-all-department-with-pagination";
import type { Route } from "./+types/department";
import { getPaginationSearchParams } from "@/common/utils/pagination.utils";
import type { FirebaseDepartment } from "@/common/types/firebase/FirebaseDepartment.type";
import ServerSidePagination from "@/common/components/server-side-pagination";
import { CrudIntent } from "@/common/types/crud-intent";
import type { ToastConfig } from "@/common/types/toast-config";
import createDepartment from "@/modules/department/firestore/create-department";
import updateDepartment from "@/modules/department/firestore/update-department";
import logicDeleteDepartmentByUid from "@/modules/department/firestore/logic-delete-department-by-uid";
import DepartmentTable from "@/modules/department/components/department-table";

export default function Department({ loaderData }: Route.ComponentProps) {
  const { departmentPaginationResponse } = loaderData;

  return (
    <div className="max-w-6xl mx-auto">
      <DepartmentTable
        departmentPaginationResponse={departmentPaginationResponse}
      />
      <ServerSidePagination<FirebaseDepartment>
        paginationMetadata={departmentPaginationResponse}
      />
    </div>
  );
}

export async function loader({ request }: Route.LoaderArgs) {
  const { limit, skip, page } = getPaginationSearchParams(request);

  const departmentPaginationResponse = await findAllDepartmentWithPagination({
    limit,
    page,
    skip,
  });

  return { departmentPaginationResponse };
}

export async function action({
  request,
}: Route.ActionArgs): Promise<{ toast: ToastConfig }> {
  const formData = await request.formData();
  const intent = formData.get("intent") as CrudIntent;

  if (intent === CrudIntent.CREATE) {
    try {
      const department: Partial<FirebaseDepartment> = {
        name: formData.get("name") as string,
        description: formData.get("description") as string,
      };
      await createDepartment(department);
    } catch (error: any) {
      return {
        toast: {
          title: "Error al crear el departamento",
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
      const department: Partial<FirebaseDepartment> = {
        uid: formData.get("uid") as string,
        name: formData.get("name") as string,
        description: formData.get("description") as string,
      };
      await updateDepartment(department);
    } catch (error: any) {
      return {
        toast: {
          title: "Error al actualizar el departamento",
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
      const departmentUid = formData.get("uid") as string;
      await logicDeleteDepartmentByUid(departmentUid);
    } catch (error: any) {
      return {
        toast: {
          title: "Error al eliminar el departamento",
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
