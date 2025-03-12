import { View, Text, Image, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import React, { useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppwrite } from "@/lib/useAppwrite";
import { createAppointment, getTrainerById } from "@/lib/appwrite";
import Button from "@/components/ui-project/Button";
import { useGlobalContext } from "@/lib/global-provider";
import { ParseTime } from "@/lib/utils";
import { parse, setHours, setMinutes, setSeconds, setMilliseconds, addDays } from "date-fns";

const Booking = () => {
    const { user } = useGlobalContext();
    const { timeslot, trainerId, date: selectedDate } = useLocalSearchParams<{ timeslot?: string, trainerId?: string; date: string }>();
    const router = useRouter();

    console.log(selectedDate);

    const [isLoading, setIsLoading] = useState(false);

    // Fetch trainer details
    const { data: trainer, loading } = useAppwrite({
        fn: getTrainerById,
        params: { id: trainerId! },
    });

    const combineDateAndTime = (date: Date, timeString: string): Date => {
        // Parse the time string into a Date object
        const parsedTime = parse(timeString, "h:mm a", new Date());

        // Normalize the time to the provided date while ensuring UTC consistency
        return setMilliseconds(
            setSeconds(
                setMinutes(
                    setHours(date, parsedTime.getHours()),
                    parsedTime.getMinutes()
                ),
                0
            ),
            0
        );
    };

    const handleConfirmBooking = async () => {
        if (!timeslot || !selectedDate) {
            return Alert.alert("Invalid date or timeslot!");
        }

        // const final = combineDateAndTime(new Date(selectedDate), timeslot!);

        try {
            setIsLoading(true);
            const body = {
                date: new Date(selectedDate),
                trainer_id: trainerId!,
                user_id: user?.user_id!,
                price: trainer?.trainingPrice || 0,
                timeSlot: timeslot
            };

            console.log(body)
            const response = await createAppointment(body);

            if (response) {
                Alert.alert(`Successfully Booked!`);
                router.push("/home");
            } else {
                Alert.alert("Failed to book. Please try again.");
            }
        } catch (error) {
            console.error("Booking error:", error);
            Alert.alert("Something went wrong!");
        } finally {
            setIsLoading(false);
        }
    };

    if (loading || isLoading) {
        return (
            <View className="items-center justify-center flex-1 bg-white">
                <ActivityIndicator size="large" color="#3498db" />
                <Text className="mt-4 text-lg text-gray-500">Loading...</Text>
            </View>
        );
    }

    return (
        <SafeAreaView className="flex-1 px-6 bg-white">
            {/* Trainer Info */}
            <View className="items-center py-6">
                <Image source={{ uri: trainer?.avatar }} className="w-24 h-24 rounded-full" />
                <Text className="mt-3 text-xl font-semibold">{trainer?.username}</Text>
                <Text className="text-gray-500">{trainer?.role}</Text>
            </View>

            {/* Booking Details */}
            <View className="gap-0 p-4 bg-gray-100 rounded-2xl">
                <Text className="text-lg font-semibold">Selected Date</Text>
                <Text className="text-lg font-medium text-primary">{new Date(selectedDate).toLocaleDateString()}</Text>
                <Text className="mt-4 text-lg font-semibold">Selected Time Slot</Text>
                <Text className="text-lg font-medium text-primary">{timeslot}</Text>
                <Text className="mt-4 text-lg font-semibold">Training Price</Text>
                <Text className="text-lg font-medium text-primary">{trainer?.trainerProfile_id.trainingPrice}</Text>
            </View>

            {/* Confirm Booking */}
            <Button
                isLoading={isLoading}
                onPress={handleConfirmBooking}
                className="mt-4"
                label="Confirm Booking"
            />
        </SafeAreaView>
    );
};

export default Booking;
