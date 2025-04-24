import type { AttendanceFormType } from "../schema/attendance.schema";

export default function parseAttendanceForm(
  formData: FormData
): AttendanceFormType {
  return {
    first_check_in_time: (formData.get("first_check_in_time") as string).length
      ? (formData.get("first_check_in_time") as string)
      : null,
    first_check_out_time: (formData.get("first_check_out_time") as string)
      .length
      ? (formData.get("first_check_out_time") as string)
      : null,
    second_check_in_time: (formData.get("second_check_in_time") as string)
      .length
      ? (formData.get("second_check_in_time") as string)
      : null,
    second_check_out_time: (formData.get("second_check_out_time") as string)
      .length
      ? (formData.get("second_check_out_time") as string)
      : null,
    observation_type: (formData.get("observation_type") as string).length
      ? (formData.get("observation_type") as string)
      : null,
    observation: (formData.get("observation") as string).length
      ? (formData.get("observation") as string)
      : null,
  };
}
