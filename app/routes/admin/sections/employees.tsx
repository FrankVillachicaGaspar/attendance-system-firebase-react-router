import EmployeeTable from "@/modules/employee/components/employee-table";
import type { Route } from "./+types/employees";
import { getPaginationSearchParams } from "@/common/utils/pagination.utils";
import findAllEmployeeWithPaginationAndFilters from "@/modules/employee/firestore/find-all-employee-with-pagination-and-filters";
import findAllDepartment from "@/modules/department/firestore/find-all-department";
import findAllJobPosition from "@/modules/job-position/firestore/find-all-job-position";
import findAllRoles from "@/modules/auth/firestore/find-all-roles";
import type { ToastConfig } from "@/common/types/toast-config";
import { CrudIntent } from "@/common/types/crud-intent";
import type { EmployeeFormType } from "@/modules/employee/schema/employee-form.schema";
import { createEmployee } from "@/modules/employee/firestore/create-employee";
import { updateEmployee } from "@/modules/employee/firestore/update-employee";
import { logicDeleteEmployee } from "@/modules/employee/firestore/logic-delete-employee";
import ServerSidePagination from "@/common/components/server-side-pagination";
import type { FirebaseEmployee } from "@/common/types/firebase/FirebaseEmployee.type";
import EmployeeFilters from "@/modules/employee/components/emloyee-department-filters";

export default function Employees({ loaderData }: Route.ComponentProps) {
  const {
    employeePaginationResponse,
    departmentList,
    jobPositionList,
    roleList,
  } = loaderData;
  return (
    <div className="flex flex-col gap-4">
      <EmployeeTable
        employeePaginationResponse={employeePaginationResponse}
        jobPositions={jobPositionList}
        departments={departmentList}
        roles={roleList}
      />
      <ServerSidePagination<FirebaseEmployee>
        paginationMetadata={employeePaginationResponse}
      />
    </div>
  );
}

export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);

  const department = url.searchParams.get("department");
  const search = url.searchParams.get("search");

  const { limit, skip, page } = getPaginationSearchParams(request);

  const departmentList = await findAllDepartment();

  const employeePaginationResponse =
    await findAllEmployeeWithPaginationAndFilters({
      limit,
      page,
      skip,
      filters: {
        department: department ?? undefined,
        search: search ?? "",
      },
    });

  const jobPositionList = await findAllJobPosition();
  const roleList = await findAllRoles();

  return {
    employeePaginationResponse,
    departmentList,
    jobPositionList,
    roleList,
  };
}

export async function action({
  request,
}: Route.ActionArgs): Promise<{ toast: ToastConfig }> {
  const formData = await request.formData();
  const intent = formData.get("intent") as CrudIntent;

  if (intent === CrudIntent.CREATE) {
    try {
      const employee: EmployeeFormType = {
        department: formData.get("department") as string,
        role: formData.get("role") as string,
        job_position: formData.get("job_position") as string,
        names: formData.get("names") as string,
        lastname: formData.get("lastname") as string,
        dni: formData.get("dni") as string,
        salary: Number(formData.get("salary")) as number,
        phone_code: formData.get("phone_code") as string,
        phone_number: formData.get("phone_number") as string,
        birth_date: formData.get("birth_date") as string,
        hiring_date: formData.get("hiring_date") as string,
        is_active: (formData.get("is_active") as string) === "true",
        email: formData.get("email") as string,
      };
      await createEmployee(employee);
    } catch (error: any) {
      return {
        toast: {
          title: "Error al crear el empleado",
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
        title: "Empleado creado exitosamente",
        description: "Empleado creado exitosamente",
        type: "success",
        closeButton: true,
        position: "top-center",
        richColors: true,
      },
    };
  }

  if (intent === CrudIntent.UPDATE) {
    try {
      const employee: EmployeeFormType = {
        department: formData.get("department") as string,
        role: formData.get("role") as string,
        job_position: formData.get("job_position") as string,
        names: formData.get("names") as string,
        lastname: formData.get("lastname") as string,
        dni: formData.get("dni") as string,
        salary: Number(formData.get("salary")) as number,
        phone_code: formData.get("phone_code") as string,
        phone_number: formData.get("phone_number") as string,
        birth_date: formData.get("birth_date") as string,
        hiring_date: formData.get("hiring_date") as string,
        is_active: (formData.get("is_active") as string) === "true",
        email: formData.get("email") as string,
      };
      const employeeUid = formData.get("uid") as string;
      await updateEmployee(employeeUid, employee);
    } catch (error: any) {
      return {
        toast: {
          title: "Error al actualizar el empleado",
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
        title: "Empleado actualizado exitosamente",
        description: "Empleado actualizado exitosamente",
        type: "success",
        closeButton: true,
        position: "top-center",
        richColors: true,
      },
    };
  }

  if (intent === CrudIntent.DELETE) {
    try {
      const employeeUid = formData.get("uid") as string;
      await logicDeleteEmployee(employeeUid);
    } catch (error: any) {
      return {
        toast: {
          title: "Error al eliminar el empleado",
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
        title: "Empleado eliminado exitosamente",
        description: "Empleado eliminado exitosamente",
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
