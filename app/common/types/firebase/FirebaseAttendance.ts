import type { FirebaseShortEmployee } from "./FirebaseEmployee.type";
import type { FirebaseShortObservationType } from "./FirebaseObservationType";
;
export type FirebaseAttendance = {
  uid: string;
  employee: FirebaseShortEmployee;
  first_check_in_time: string | null;
  first_check_out_time: string | null;
  second_check_in_time: string | null;
  second_check_out_time: string | null;
  observation_type: FirebaseShortObservationType | null;
  observation: string | null;
  work_hours: number;
  overtime: number;
  created_at: string;
  deleted_at: string | null;
};
