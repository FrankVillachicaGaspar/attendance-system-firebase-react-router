import type { FirebaseEmployee } from "@/common/types/firebase/FirebaseEmployee.type";
import type { PaginationResponse } from "@/common/types/pagination-response.type";
import { getPaginationMetadata } from "@/common/utils/pagination.utils";
import { adminFirestoreDb } from "@/lib/firebase.server";
import type {
  DocumentReference,
  QueryDocumentSnapshot,
} from "firebase-admin/firestore";

interface Filters {
  department?: string;
  search?: string;
}

export default async function findAllEmployeeWithPaginationAndFilters({
  limit,
  skip,
  page,
  filters,
}: {
  limit: number;
  skip: number;
  page: number;
  filters: Filters;
}): Promise<PaginationResponse<FirebaseEmployee[]>> {
  // Comenzamos con la referencia base sin aplicar limit ni offset
  const employeeCollectionRef = adminFirestoreDb
    .collection("employee")
    .where("deleted_at", "==", null)
    .orderBy("created_at", "desc");

  let employeeListRef = employeeCollectionRef;

  // Aplicamos filtro por departamento si es necesario
  if (filters.department && filters.department !== "Todos") {
    console.log("Department - filters.department", filters.department);
    const departmentRef = adminFirestoreDb
      .collection("department")
      .doc(filters.department);
    employeeListRef = employeeListRef.where("department", "==", departmentRef);
  }

  // Obtenemos todos los empleados con los filtros de departamento aplicados
  const employeeListSnap = await employeeListRef.get();

  // Obtenemos los datos completos de cada empleado
  const allEmployees = await Promise.all(
    employeeListSnap.docs.map(async (doc) => {
      if (doc.exists) {
        return await getEmployeeData(doc);
      }
      return null;
    })
  );

  // Filtramos los empleados nulos
  let filteredEmployees = allEmployees.filter(
    (employee) => employee !== null
  ) as FirebaseEmployee[];

  // Aplicamos el filtro de búsqueda por nombre y apellido si es necesario
  if (filters.search && filters.search.trim() !== "") {
    const searchTerm = normalizeText(filters.search.trim());

    filteredEmployees = filteredEmployees.filter((employee) => {
      // Concatenamos nombres y apellidos para buscar coincidencias
      const fullName = normalizeText(
        `${employee.names?.toLowerCase() || ""} ${
          employee.lastname?.toLowerCase() || ""
        }`
      );
      return fullName.includes(searchTerm);
    });
  }

  // Filtramos los empleados que no tienen un departamento eliminado
  filteredEmployees = filteredEmployees.filter((employee) => {
    return employee.department.deleted_at === null;
  });

  // Calculamos el total de elementos después de aplicar todos los filtros
  const totalItems = filteredEmployees.length;
  const totalPages = Math.ceil(totalItems / limit);

  // Aplicamos la paginación manualmente
  const paginatedEmployees = filteredEmployees.slice(skip, skip + limit);

  // Calculamos metadata de paginación
  const nextPage = page < totalPages ? page + 1 : null;
  const prevPage = page > 1 ? page - 1 : null;

  return {
    data: paginatedEmployees,
    page,
    totalItems,
    totalPages,
    nextPage,
    prevPage,
  } as PaginationResponse<FirebaseEmployee[]>;
}

async function getEmployeeData(doc: QueryDocumentSnapshot<any>) {
  const roleRef: DocumentReference = doc.data().role;
  const jobPositionRef: DocumentReference = doc.data().job_position;
  const departmentRef: DocumentReference = doc.data().department;

  const roleSnap = await roleRef.get();
  const jobPositionSnap = await jobPositionRef.get();
  const departmentSnap = await departmentRef.get();

  if (!roleSnap.exists || !jobPositionSnap.exists || !departmentSnap.exists) {
    throw new Error("Error al obtener los datos del empleado");
  }

  return {
    ...doc.data(),
    uid: doc.id,
    role: {
      uid: roleSnap.id,
      ...roleSnap.data(),
    },
    job_position: {
      uid: jobPositionSnap.id,
      ...jobPositionSnap.data(),
    },
    department: {
      uid: departmentSnap.id,
      ...departmentSnap.data(),
    },
  } as FirebaseEmployee;
}

/**
 * Normaliza un texto eliminando acentos y convirtiéndolo a minúsculas
 * @param text Texto a normalizar
 * @returns Texto normalizado sin acentos y en minúsculas
 */
function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD") // Descompone los caracteres acentuados
    .replace(/[\u0300-\u036f]/g, ""); // Elimina los diacríticos
}
