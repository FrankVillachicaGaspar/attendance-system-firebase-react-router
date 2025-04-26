import type {
  FirebaseDepartment,
  FirebaseShortDepartment,
} from "./FirebaseDepartment.type";
import type { FirebaseJobPosition, FirebaseShortJobPosition } from "./FirebaseJobPosition";
import type { FirebaseRole } from "./FirebaseRole.type";

export type FirebaseEmployee = {
  uid: string;
  department: FirebaseDepartment;
  role: FirebaseRole;
  job_position: FirebaseJobPosition;
  birth_date: string;
  dni: string;
  hiring_date: string;
  is_active: boolean;
  lastname: string;
  names: string;
  phone_code: string;
  phone_number: string;
  salary: number;
  email: string;
  deleted_at: string | null;
};

export type FirebaseShortEmployee = {
  uid: string;
  names: string;
  lastname: string;
  dni: string;
  department: FirebaseShortDepartment;
  job_position: FirebaseShortJobPosition;
};
