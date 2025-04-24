export type FirebaseObservationType = {
  uid: string;
  name: string;
  description: string;
  created_at: string;
  deleted_at: string | null;
};

export type FirebaseShortObservationType = {
  uid: string;
  name: string;
  description: string;
};
