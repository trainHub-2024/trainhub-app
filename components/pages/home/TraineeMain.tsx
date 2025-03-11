import { View, Text, TouchableOpacity, ScrollView, Image } from "react-native";
import React, { useEffect, useState } from "react";
import { useGlobalContext } from "@/lib/global-provider";
import icons from "@/constants/icons";
import { router, useLocalSearchParams } from "expo-router";
import { useAppwrite } from "@/lib/useAppwrite";
import { getUserAppointments, getUserUpcomingAppointments } from "@/lib/appwrite";
import { mapIdToNumber, ParseTime } from "@/lib/utils";
import UpcomingAppointments from "./UpcomingAppointments";
import CompletedAppointments from "./CompletedAppointments";
import { SafeAreaView } from "react-native-safe-area-context";
import TraineeHeader from "./_components/trainee-header";
import images from "@/constants/images";
import DisplayCalendar from "./_components/trainee-display-calendar";

const HomeTraineeMain = () => {
    const { user } = useGlobalContext();

    const [selectedDate, setSelectedDate] = useState(new Date())

    const number = mapIdToNumber(user?.profile?.$id ?? "")

    const avatar: any = {
        1: images.avatar_1,
        2: images.avatar_2,
        3: images.avatar_3,
        4: images.avatar_4,
    };


    return (
        <SafeAreaView className="flex-1 bg-white">
            <ScrollView showsVerticalScrollIndicator={false} className="px-7" contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}>
                {/* Header */}
                <TraineeHeader />


                {/* ADS */}
                <View className="relative justify-between w-full p-6 mt-8 border" style={{ backgroundColor: "#fb8500", borderRadius: 20, height: 170 }}>
                    <View>
                        <Text className="text-4xl text-white font-poppinsBold">
                            Daily
                        </Text>
                        <Text className="text-4xl text-white font-poppinsBold">
                            Challenge
                        </Text>
                    </View>
                    <View>
                        <Text className="text-white font-poppins">
                            Challenge yourself and
                        </Text>
                        <Text className="text-white font-poppins">
                            find the best trainer to help you!
                        </Text>
                    </View>
                    <Image
                        style={{ width: 160, height: 160, position: "absolute", top: -20, right: -30 }}
                        source={avatar[number]}
                    />
                </View>

                {/* Calendar */}
                <DisplayCalendar selectedDate={selectedDate} setSelectedDate={setSelectedDate} />

                <UpcomingAppointments selectedDate={selectedDate} />
                <CompletedAppointments selectedDate={selectedDate} />

            </ScrollView>
        </SafeAreaView>


        //     {/* Training Appointments */}
        //     <UpcomingAppointments />
        //     <CompletedAppointments />

        // </>
    );
};

export default HomeTraineeMain;
