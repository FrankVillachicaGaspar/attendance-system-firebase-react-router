import { adminFirestoreDb } from "@/lib/firebase.server";
import { endOfToday, startOfToday } from "date-fns";
import { Timestamp } from "firebase-admin/firestore";

export default async function verifyTodayAttendanceByEmployee(
  employeeRef: FirebaseFirestore.DocumentReference
) {
  const todayStart = startOfToday();
  const todayEnd = endOfToday();

  console.log(todayStart.toLocaleString(), todayEnd.toLocaleString());

  const query = adminFirestoreDb
    .collection("attendance")
    .where("employee", "==", employeeRef)
    .where("created_at", ">=", Timestamp.fromDate(todayStart))
    .where("created_at", "<=", Timestamp.fromDate(todayEnd));

  const snapshot = await query.get();

  if (snapshot.empty) {
    return true;
  }
  return false;
}
