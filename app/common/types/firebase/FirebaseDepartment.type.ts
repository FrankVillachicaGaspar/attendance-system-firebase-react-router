export type FirebaseDepartment = {
  uid: string;
  name: string;
  description: string;
  created_at: string;
  deleted_at: string | null;
};

export type FirebaseShortDepartment = {
  uid: string;
  name: string;
  description: string;
};
