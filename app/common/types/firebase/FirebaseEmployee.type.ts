import type { FirebaseDepartment } from "./FirebaseDepartment.type";
import type { FirebaseRole } from "./FirebaseRole.type";

export type FirebaseEmployee = {
  uid: string;
  birth_date: string;
  department: FirebaseDepartment;
  dni: string;
  hiring_date: string;
  is_active: boolean;
  is_deleted: string | null;
  lastname: string;
  names: string;
  phone_code: string;
  phone_number: string;
  position: string;
  salario: string;
  role: FirebaseRole;
  email: string;
};
