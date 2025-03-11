import { AppointmentType } from "@/types";

export function computeLevel(score: number) {
    return 1 + Math.floor(score / 5);
}

export function formatAppointment(data: any): AppointmentType {
    const {
        $id,
        userProfile,
        trainerProfile,
        price,
        date,
        paymentDate,
        status,
        isConfirmedPayment,
        paymentMethod
    } = data;

    return {
        $id,
        userProfile,
        trainerProfile,
        price,
        date,
        paymentDate,
        status,
        isConfirmedPayment,
        paymentMethod
    }
}