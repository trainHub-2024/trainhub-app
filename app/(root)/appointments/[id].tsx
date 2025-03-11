import { View, Text, ActivityIndicator, Alert, TouchableOpacity, Image, ScrollView } from "react-native";
import React, { useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useAppwrite } from "@/lib/useAppwrite";
import { confirmPayment, creatInbox, getAppointmentById, updateStatusAppointmentById } from "@/lib/appwrite";
import { SafeAreaView } from "react-native-safe-area-context";
import Button from "@/components/ui-project/Button";
import { useGlobalContext } from "@/lib/global-provider";
import RatingModal from "@/components/pages/appointments/RatingModal";

const Appointment = () => {
    const { user, refetch } = useGlobalContext();
    const { id } = useLocalSearchParams<{ id?: string }>();
    const router = useRouter();
    const { data: appointment, loading, refetch: refetchAppointment } = useAppwrite({
        fn: getAppointmentById,
        params: { id: id! },
    });

    console.log(appointment?.rating)

    const trainerProfileId = appointment?.trainerProfile.$id ?? "";
    const userProfileId = appointment?.userProfile.$id ?? "";

    const isPaid: boolean = appointment?.paymentDate ? true : false;
    const hasConfirmedPayment: boolean = appointment?.isConfirmedPayment ? appointment?.isConfirmedPayment : false

    console.log("PAID: " + isPaid);
    console.log(appointment?.paymentDate)
    console.log(appointment?.paymentMethod)

    const [isLoading, setIsLoading] = useState(false);

    const handleCancel = async () => {
        Alert.alert(
            "Cancel Appointment",
            "Are you sure you want to cancel this appointment?",
            [
                {
                    text: "No",
                    style: "cancel",
                },
                {
                    text: "Yes, Cancel",
                    onPress: async () => {
                        try {
                            setIsLoading(true);
                            await updateStatusAppointmentById({ id: id!, status: "cancelled" }); // Call the cancellation function
                            Alert.alert("Cancelled appointment!");
                            refetch();
                            router.replace("/explore"); // Navigate back after cancellation
                        } catch (error) {
                            Alert.alert("Error", "Failed to cancel appointment. Please try again.");
                        } finally {
                            setIsLoading(false);
                        }
                    },
                },
            ]
        );
    };

    const handleConfirm = async () => {
        Alert.alert(
            "Confirm Appointment",
            "Are you sure you want to confirm this appointment?",
            [
                {
                    text: "No",
                    style: "cancel",
                },
                {
                    text: "Yes, Confirm",
                    onPress: async () => {
                        try {
                            setIsLoading(true);
                            await updateStatusAppointmentById({ id: id!, status: "confirmed" }); // Call the cancellation function
                            router.replace("/explore"); // Navigate back after cancellation
                        } catch (error) {
                            Alert.alert("Error", "Failed to confirm appointment. Please try again.");
                        } finally {
                            setIsLoading(false);
                        }
                    },
                },
            ]
        );
    };

    const handleComplete = async () => {
        Alert.alert(
            "Complete Appointment",
            "Are you sure you want to copmlete this appointment?",
            [
                {
                    text: "No",
                    style: "cancel",
                },
                {
                    text: "Yes, Complete",
                    onPress: async () => {
                        try {
                            setIsLoading(true);
                            const res = await updateStatusAppointmentById({ id: id!, status: "completed" }); // Call the cancellation function
                            Alert.alert("Completed!", "Thank you! Your score has been updated");
                            refetch();
                            router.replace("/explore"); // Navigate back after cancellation
                        } catch (error) {
                            Alert.alert("Error", "Failed to complete appointment. Please try again.");
                        } finally {
                            setIsLoading(false);
                        }
                    },
                },
            ]
        );
    };

    const handleConfirmPayment = async () => {
        if (!appointment?.$id) {
            alert("Appointment not found!");
            return;
        }

        try {
            setIsLoading(true);

            const res = await confirmPayment(appointment.$id)
            if (res) {
                alert("Confirmed Payment! Thank you!")
                refetchAppointment({ id: appointment.$id })
            }
        } catch (error) {

        } finally {
            setIsLoading(false);
        }
    }

    const handleCreateChat = async () => {
        if (!appointment?.userProfile_id || !appointment?.trainerProfile_id) {
            alert("Invalid Appointment");
            return;
        }

        try {
            const res = await creatInbox({
                trainerProfile_id: appointment.trainerProfile_id,
                userProfile_id: appointment.userProfile_id
            })

            if (res) {
                router.push(`/inboxes/${res.$id}`);
            }
        } catch (error) {
            console.log(error)
            alert(error)
        } finally {

        }

    }

    if (loading || isLoading) {
        return (
            <SafeAreaView className="items-center justify-center flex-1">
                <ActivityIndicator size="large" color="#007AFF" />
            </SafeAreaView>
        );
    }

    if (!appointment) {
        return (
            <SafeAreaView className="items-center justify-center flex-1">
                <Text className="text-lg font-semibold text-red-500">
                    Appointment not found.
                </Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView className="flex-1 px-4 bg-white">
            <ScrollView
                showsVerticalScrollIndicator={false}
            >
                {/* Back Button */}
                {/* <TouchableOpacity onPress={() => router.replace("/explore")} className="w-10 p-3 bg-gray-200 rounded-full">
                <Text className="text-lg text-center">←</Text>
            </TouchableOpacity> */}

                {/* Header */}
                <View className="flex-row items-center justify-between py-4">
                    <Text className="text-2xl font-bold text-primary">Appointment</Text>
                    <TouchableOpacity onPress={handleCreateChat}>
                        <View>
                            <Text>Message</Text>
                        </View>
                    </TouchableOpacity>
                </View>

                {/* Appointment Details */}
                <View className="p-4 mb-4 bg-gray-100 rounded-lg">
                    <Text className="text-lg font-semibold uppercase">Status: {appointment.status}</Text>
                    <Text className="text-base text-gray-600">Date: {new Date(appointment.date).toLocaleString()}</Text>
                    <Text className="text-base text-gray-600">Price: {appointment.price}</Text>
                </View>

                {/* Trainer Details */}
                <View className="p-4 mb-4 bg-gray-100 rounded-lg">
                    <Text className="text-lg font-semibold">Trainer</Text>
                    <Text className="text-base text-gray-600">Name: {appointment.trainerProfile?.name}</Text>
                    <Text className="text-base text-gray-600">Location: {appointment.trainerProfile?.location}</Text>
                    <Text className="text-base text-gray-600">Contact: {appointment.trainerProfile?.contactNumber}</Text>
                </View>

                {/* User Details */}
                <View className="p-4 bg-gray-100 rounded-lg">
                    <Text className="text-lg font-semibold">Trainee</Text>
                    <Text className="text-base text-gray-600">Name: {appointment.userProfile?.name}</Text>
                    <Text className="text-base text-gray-600">Location: {appointment.userProfile?.location}</Text>
                    <Text className="text-base text-gray-600">Contact: {appointment.userProfile?.contactNumber}</Text>
                </View>

                {/* Buttons */}
                <View className="gap-2 mt-6">

                    {appointment.status === "completed" &&
                        <>
                            {user?.role === "trainee" ?
                                <>
                                    {
                                        isPaid ? <>
                                            {hasConfirmedPayment ? <>
                                                {appointment?.rating ? <>
                                                    <View className="p-4 bg-gray-100 rounded-lg">
                                                        <Text className="text-lg font-semibold">Rating</Text>
                                                        <Text className="text-base text-gray-600">Rating: {appointment?.rating?.rating}</Text>
                                                    </View>
                                                </> : <>
                                                    <RatingModal trainerId={trainerProfileId} userId={userProfileId} appointmentId={id ?? ""} />
                                                </>}
                                            </> : <>
                                                <Text>Please wait while the trainer confirms your payment</Text>
                                            </>}
                                        </> : <>
                                            <Button
                                                onPress={() => router.push(`/payment/${id}`)}
                                                variant="success"
                                                label="Proceed to Payment"
                                            />
                                        </>
                                    }
                                </> : <>
                                    {isPaid ?
                                        <>
                                            {hasConfirmedPayment ? <>
                                                <View>
                                                    <View>
                                                        <Text>
                                                            Payment Method:
                                                            <Text className="font-bold capitalize"> {appointment?.paymentMethod}</Text>
                                                        </Text>
                                                        <Text>
                                                            Payment Date:
                                                            <Text className="font-bold "> {new Date(appointment?.paymentDate).toLocaleDateString()}</Text>
                                                        </Text>
                                                        {
                                                            appointment?.paymentImage && (
                                                                <View className="relative w-full mt-2 aspect-square">
                                                                    <Image
                                                                        source={{ uri: appointment?.paymentImage }} // ✅ Ensure the correct property is accessed
                                                                        resizeMode="cover"
                                                                        className="rounded-md size-full"
                                                                    />
                                                                </View>
                                                            )
                                                        }
                                                    </View>
                                                </View>
                                            </> : <>
                                                <View>
                                                    <View>
                                                        <Text>
                                                            Payment Method:
                                                            <Text className="font-bold capitalize"> {appointment?.paymentMethod}</Text>
                                                        </Text>
                                                        <Text>
                                                            Payment Date:
                                                            <Text className="font-bold "> {new Date(appointment?.paymentDate).toLocaleDateString()}</Text>
                                                        </Text>
                                                        {
                                                            appointment?.paymentImage && (
                                                                <View className="relative w-full mt-2 aspect-square">
                                                                    <Image
                                                                        source={{ uri: appointment?.paymentImage }} // ✅ Ensure the correct property is accessed
                                                                        resizeMode="cover"
                                                                        className="rounded-md size-full"
                                                                    />
                                                                </View>
                                                            )
                                                        }
                                                    </View>
                                                    <Button
                                                        className="mt-2"
                                                        isLoading={isLoading}
                                                        onPress={handleConfirmPayment}
                                                        variant="success"
                                                        label="Confirm Payment"
                                                    />
                                                </View>
                                            </>}
                                        </>
                                        :
                                        <View className="gap-4">
                                            <View>
                                                <Text className="text-center">
                                                    Payment being processed...
                                                </Text>
                                            </View>

                                        </View>
                                    }
                                </>
                            }
                        </>}

                    {appointment.status === "cancelled" && (
                        <>
                            <Button
                                variant="secondary"
                                label={"Cancelled"}
                                isLoading={true}
                            />
                        </>
                    )}

                    {appointment.status === "pending" && (
                        <>
                            {user?.role === "trainee" ? (
                                <Button
                                    variant="destructive"
                                    label={"Cancel Appointment"}
                                    isLoading={isLoading}
                                    onPress={handleCancel}
                                />
                            ) :
                                <>
                                    <Button
                                        variant="default"
                                        label={"Confirm Appointment"}
                                        isLoading={isLoading}
                                        onPress={handleConfirm}
                                    />
                                    <Button
                                        variant="destructive"
                                        label={"Cancel Appointment"}
                                        isLoading={isLoading}
                                        onPress={handleCancel}
                                    />
                                </>}
                        </>
                    )}

                    {appointment.status === "confirmed" && (
                        <>
                            <Button
                                variant="default"
                                label={"Complete Appointment"}
                                isLoading={isLoading}
                                onPress={handleComplete}
                            />
                            <Button
                                variant="destructive"
                                label={"Cancel Appointment"}
                                isLoading={isLoading}
                                onPress={handleCancel}
                            />
                        </>
                    )}

                </View>
            </ScrollView>

        </SafeAreaView>
    );
};

export default Appointment;
