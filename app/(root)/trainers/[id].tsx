import { View, Text, ScrollView, Image, TouchableOpacity } from "react-native";
import React, { useMemo, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useAppwrite } from "@/lib/useAppwrite";
import { creatInbox, getTrainerById } from "@/lib/appwrite";
import { SafeAreaView } from "react-native-safe-area-context";
import { ParseTime } from "@/lib/utils";
import { format } from "date-fns";
import CalendarBooking from "./_components/calendar";
import { FontAwesome } from "@expo/vector-icons";
import { useGlobalContext } from "@/lib/global-provider";
import icons from "@/constants/icons";
import { computeLevel } from "@/utils";

const Trainer = () => {
    const { user } = useGlobalContext();
    const { id } = useLocalSearchParams<{ id?: string }>();
    const router = useRouter();
    const { data: trainer, loading } = useAppwrite({
        fn: getTrainerById,
        params: { id: id! },
    });

    const workDays = trainer?.trainerProfile_id?.workDays || [];


    // Generate 30-minute time slots for the selected day
    const generateTimeSlots = (start: string, end: string) => {
        const startTime = new Date(start);
        const endTime = new Date(end);
        let slots = [];

        while (startTime < endTime) {
            const slot = ParseTime(new Date(startTime));
            startTime.setMinutes(startTime.getMinutes() + 30);
            slots.push(slot);
        }

        return slots;
    };

    const timeSlots = generateTimeSlots(
        trainer?.trainerProfile_id?.startTime,
        trainer?.trainerProfile_id?.endTime
    );

    // Handle selecting a time slot
    const handleSelectTimeSlot = (slot: string, selectedDate: Date) => {
        router.push({
            pathname: "/booking",
            params: { timeslot: slot, trainerId: id, date: format(selectedDate, "yyyy-MM-dd") },
        });
    };

    const handleCreateChat = async () => {
        if (!user?.profile.$id || !trainer?.trainerProfile_id.$id) {
            alert("Invalid Chat");
            return;
        }

        try {
            const res = await creatInbox({
                trainerProfile_id: trainer.trainerProfile_id.$id,
                userProfile_id: user?.profile.$id
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

    const contactNumber = `${trainer?.trainerProfile_id?.contactNumber?.substring(0, 2)}xx xxx xxxx`

    const score = trainer?.trainerProfile_id?.score ?? 0;
    const ratings = trainer?.trainerProfile_id?.ratings ?? [];
    const { totalRating, averageRating } = useMemo(() => {

        const totalRating = ratings?.reduce((acc: any, curr: any) => acc + curr.rating, 0);
        const averageRating = ratings?.length > 0 ? totalRating / ratings.length : 0;

        return { totalRating, averageRating };
    }, [ratings])

    if (loading) return null;


    return (
        <SafeAreaView className="flex-1 bg-primary">
            <View className="bg-primary" style={{ height: 100, position: "relative" }}>
                <View className="absolute z-10 -translate-x-1/2 bg-white border-4 border-white rounded-full -bottom-16 left-1/2" style={{ width: 120, height: 120 }}>
                    <Image source={{ uri: trainer?.avatar }} className="rounded-full size-full" />
                    {trainer?.trainerProfile_id?.isCertified && (
                        <View className="absolute bottom-0 right-0">
                            <FontAwesome name={"check-circle"} size={28} color={"#fb8500"} />
                        </View>
                    )}
                </View>
            </View>
            <ScrollView showsVerticalScrollIndicator={false} className="h-full pt-16 bg-white">
                <View className="flex-1 px-6 pb-10">

                    <Text className="pt-4 text-2xl text-center font-poppinsBold text-primary">{trainer?.username}</Text>

                    <View className="px-10 mt-2">
                        <Text className="text-center font-poppins">{trainer?.trainerProfile_id?.bio}</Text>
                    </View>

                    <View className='flex-row items-center justify-center gap-1'>
                        <View className='px-2 py-0.5 flex-row gap-1 bg-white rounded-full justify-start items-center'>
                            <Image source={icons.dumbell} tintColor={"#f97316"} resizeMode='contain' className='size-6' />
                            <Text className="text-base text-muted-foreground font-poppins">Level {computeLevel(score)}</Text>
                        </View>
                        <View className='px-2 py-0.5 flex-row gap-1 bg-white rounded-full justify-start items-center'>
                            <FontAwesome name="star" size={16} color={"#fb8500"} />
                            <Text className="text-base text-muted-foreground font-poppins">{averageRating.toFixed(2)} stars</Text>
                        </View>
                    </View>

                    <View className="flex-row items-center justify-center gap-4 mt-2">
                        <View className="flex-row gap-1">
                            <FontAwesome name="map" size={16} color={"#fb8500"} />
                            <Text className="text-base text-muted-foreground font-poppins">{trainer?.trainerProfile_id?.location}</Text>
                        </View>
                        <View className="flex-row gap-1">
                            <FontAwesome name="phone" size={16} color={"#fb8500"} />
                            <Text className="text-base text-muted-foreground font-poppins">{contactNumber}</Text>
                        </View>
                    </View>

                    <View className="mt-4">
                        <Text className="text-4xl text-center font-poppinsBold text-primary">${trainer?.trainerProfile_id?.trainingPrice}</Text>
                    </View>

                    <View className="flex-row items-center justify-center gap-2 my-6">
                        <TouchableOpacity onPress={handleCreateChat} className="flex flex-row items-center justify-center flex-1 gap-2 rounded-full bg-primary h-14">
                            <FontAwesome name="send" size={20} color={"white"} />
                            <Text className="text-xl text-white font-poppinsBold">Message</Text>
                        </TouchableOpacity>
                    </View>

                    <CalendarBooking
                        timeSlots={timeSlots}
                        handleSelectTimeSlot={handleSelectTimeSlot}
                        workDays={workDays}
                    />

                </View>
            </ScrollView>
        </SafeAreaView>
        // <SafeAreaView className="flex-1 bg-white">
        //     <ScrollView showsVerticalScrollIndicator={false} contentContainerClassName="pb-32 px-6">

        //         {/* Back Button
        //         {/* <TouchableOpacity onPress={() => router.push("/explore")} className="w-10 p-3 bg-gray-200 rounded-full">
        //             <Text className="text-lg text-center">←</Text>
        //         </TouchableOpacity> */}

        //         {/* Profile Header */}
        //         <View className="items-center py-6">
        //             <Image source={{ uri: trainer?.avatar }} className="w-24 h-24 rounded-full" />
        //             <Text className="mt-3 text-xl font-semibold">{trainer?.username}</Text>
        //             <Text className="text-gray-500">{trainer?.role}</Text>
        //         </View>

        //         {/* Contact Info */}
        //         <View className="p-4 bg-gray-100 rounded-2xl">
        //             <Text className="text-lg font-semibold">Contact</Text>
        //             <Text className="text-gray-700">📧 {trainer?.email}</Text>
        //             <Text className="text-gray-700">📞 {trainer?.trainerProfile_id?.contactNumber}</Text>
        //             <Text className="text-gray-700">📍 {trainer?.trainerProfile_id?.location}</Text>
        //         </View>

        //         {/* Bio Section */}
        //         <View className="p-4 mt-4 bg-gray-100 rounded-2xl">
        //             <Text className="text-lg font-semibold">About</Text>
        //             <Text className="text-gray-700">{trainer?.trainerProfile_id?.bio}</Text>
        //         </View>

        //         {/* Work Schedule */}
        //         <View className="p-4 mt-4 bg-gray-100 rounded-2xl">
        //             <Text className="text-lg font-semibold">Work Schedule</Text>
        //             <Text className="text-gray-700">
        //                 🕒 {ParseTime(new Date(trainer?.trainerProfile_id?.startTime))} - {ParseTime(new Date(trainer?.trainerProfile_id?.endTime))}
        //             </Text>
        //             <Text className="text-gray-700">📅 {trainer?.trainerProfile_id?.workDays.join(", ")}</Text>
        //         </View>

        //         {/* Calendar Navigation */}
        // <CalendarBooking
        //     timeSlots={timeSlots}
        //     handleSelectTimeSlot={handleSelectTimeSlot}
        //     workDays={workDays}
        // />

        //         {/* Certification Status */}
        // <View className="flex-row items-center p-4 mt-4 bg-gray-100 rounded-2xl">
        //     <Text className="text-lg font-semibold">Certification: </Text>
        //     <Text className={`text-white px-3 py-1 rounded-full ${trainer?.trainerProfile_id?.isCertified ? "bg-green-500" : "bg-red-500"}`}>
        //         {trainer?.trainerProfile_id?.isCertified ? "Certified ✅" : "Not Certified ❌"}
        //     </Text>
        // </View> */}

        //     </ScrollView>
        // </SafeAreaView>
    );
};

export default Trainer;
