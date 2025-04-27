import { adminFirestoreDb } from "@/lib/firebase.server";
import { endOfToday, startOfToday } from "date-fns";

export default async function verifyTodayAttendanceByEmployee(
  employeeRef: FirebaseFirestore.DocumentReference,
  date: string
) {
  const todayStart = startOfToday();
  const todayEnd = endOfToday();

  console.log(todayStart.toLocaleString(), todayEnd.toLocaleString());

  const query = adminFirestoreDb
    .collection("attendance")
    .where("employee", "==", employeeRef)
    .where("created_at_date", "==", date);

  const snapshot = await query.get();

  if (snapshot.empty) {
    return true;
  }
  return false;
}
