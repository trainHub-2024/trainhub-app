import { Models } from "react-native-appwrite";
import { UserProfileType } from ".";

export interface Sport extends Models.Document {
  name: string;
}

export interface Appointment extends Models.Document {
  name: string;
  userProfile: UserProfileType;
  trainerProfile: UserProfileType;
  price: number;
  date: Date;
  paymentDate: Date;
  status: string;
  isConfirmedPayment: boolean;
  paymentMethod: "online" | "cash";
  timeSlot?: string;
}
