import { View, SafeAreaView, Text, ActivityIndicator, Alert, TouchableOpacity, Image, ScrollView, RefreshControl } from "react-native";
import React, { useCallback, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useAppwrite } from "@/lib/useAppwrite";
import { confirmPayment, creatInbox, getAppointmentById, updateStatusAppointmentById } from "@/lib/appwrite";
import Button from "@/components/ui-project/Button";
import { useGlobalContext } from "@/lib/global-provider";
import RatingModal from "@/components/pages/appointments/RatingModal";
import AppointmentDetails from "./_components/appointment-details";
import StatusDetails from "./_components/status-details";
import UserDetails from "./_components/user-details";
import PaymentDetails from "./_components/payment-details";
import AppointmentButtons from "./_components/buttons";

const Appointment = () => {
    const { user, refetch } = useGlobalContext();
    const { id } = useLocalSearchParams<{ id?: string }>();
    const router = useRouter();
    const { data: appointment, loading, refetch: refetchAppointment } = useAppwrite({
        fn: getAppointmentById,
        params: { id: id! },
    });


    const trainerProfileId = appointment?.trainerProfile?.$id ?? "";
    const userProfileId = appointment?.userProfile?.$id ?? "";

    const isPaid: boolean = appointment?.paymentDate ? true : false;
    const hasConfirmedPayment: boolean = appointment?.isConfirmedPayment ? appointment?.isConfirmedPayment : false

    const [isLoading, setIsLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

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
                        Alert.prompt(
                            "Enter Location",
                            "Please enter the location or venue for the appointment:",
                            [
                                {
                                    text: "Cancel",
                                    style: "cancel",
                                },
                                {
                                    text: "OK",
                                    onPress: async (location) => {
                                        try {
                                            setIsLoading(true);
                                            await updateStatusAppointmentById({ id: id!, status: "confirmed", location }); // Pass the location
                                            router.replace("/explore"); // Navigate back after confirmation
                                        } catch (error) {
                                            Alert.alert("Error", "Failed to confirm appointment. Please try again.");
                                        } finally {
                                            setIsLoading(false);
                                        }
                                    },
                                },
                            ],
                            "plain-text"
                        );
                    },
                },
            ]
        );
    };

    const handleComplete = async () => {
        Alert.alert(
            "Complete Appointment",
            "Are you sure you want to complete this appointment?",
            [
                {
                    text: "No",
                    style: "cancel",
                },
                {
                    text: "Yes, Complete",
                    onPress: async () => {
                        promptDuration()
                    },
                },
            ]
        );


    };

    const promptDuration = () => {
        Alert.prompt(
            "Enter Duration",
            "Please enter the duration of the appointment in hours:",
            [
                {
                    text: "Cancel",
                    style: "cancel",
                },
                {
                    text: "OK",
                    onPress: async (duration: any) => {
                        if (parseFloat(duration) < 1) {
                            Alert.alert("Invalid Duration", "The duration must be at least 1 hour.");
                            return;
                        }

                        try {
                            setIsLoading(true);
                            const res = await updateStatusAppointmentById({ id: id!, status: "completed", duration }); // Call the completion function
                            Alert.alert("Completed!", "Thank you! Your score has been updated");
                            refetch();
                            router.replace("/explore"); // Navigate back after completion
                        } catch (error) {
                            Alert.alert("Error", "Failed to complete appointment. Please try again.");
                        } finally {
                            setIsLoading(false);
                        }
                    },
                },
            ],
            "plain-text"
        );
    }

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

    const handleRefetch = () => {
        refetchAppointment({ id: appointment.$id })
    }

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await refetchAppointment({ id: appointment?.$id! });
        setRefreshing(false);
    }, [appointment]);

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
        <SafeAreaView className="flex-1 bg-muted">
            <View className="flex-1 px-7">
                <View className="bg-muted py-4">
                    <Text className="font-poppinsBold text-xl text-primary text-center">Review Appointment</Text>
                </View>

                <ScrollView
                    className="flex-1"
                    contentContainerStyle={{ gap: 12 }}
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                    }
                >

                    <AppointmentDetails data={appointment as any} />
                    <UserDetails data={appointment as any} />
                    <PaymentDetails data={appointment as any} />
                    <AppointmentButtons data={appointment as any} refetch={handleRefetch} />

                </ScrollView>
            </View>
        </SafeAreaView>
    );
};

export default Appointment;
