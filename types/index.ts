export type UserRoleType = "trainer" | "trainee";
export type UserProfileType = {
  $id: string;
  score?: number;
  name: string;
  email: string;
  gender: string;
  contactNumber: string;
  location: string;
  certification?: string;
  isCertified?: boolean;
  isDisabled?: boolean;

  trainingPrice?: number;
  startTime?: Date;
  endTime?: Date;
  workDays: string[];
  qrCodePayment: any;
  sports_id: string[];

  ratings: any[];

  appointments: any[];

};

export type AppointmentType = {
  $id: string;
  userProfile: UserProfileType;
  trainerProfile: UserProfileType;
  price: number;
  date: Date;
  paymentDate: Date;
  status: string;
  isConfirmedPayment: boolean;
  paymentMethod: "online" | "cash";
};
