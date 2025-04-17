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
  duration?: number;
}

export interface AppointmentShort extends Models.Document {
  date: string;
  duration: number;
  isConfirmedPayment: boolean;
  isPenalized: boolean;
  notes: string;
  paymentDate: string;
  paymentImage: string;
  paymentMethod?: "online" | "cash";
  price: number;
  status: string;
  timeSlot: string;
  trainerProfile_id: string;
  userProfile_id: string;
  venue: string;
}
