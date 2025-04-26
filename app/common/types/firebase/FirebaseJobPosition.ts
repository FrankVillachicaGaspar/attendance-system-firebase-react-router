export type FirebaseJobPosition = {
  uid: string;
  name: string;
  description: string;
  created_at: string;
  deleted_at: string | null;
};

export type FirebaseShortJobPosition = {
  uid: string;
  name: string;
  description: string;
};
