import { View, Text, Image, SafeAreaView } from 'react-native';
import React, { useEffect, useMemo, useState } from 'react';
import { useGlobalContext } from '@/lib/global-provider';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useAppwrite } from '@/lib/useAppwrite';
import { getPaidAppointments } from '@/lib/appwrite';
import { computeTrainerIncome } from '@/lib/utils';

const HomeTrainerMain = () => {
    const { user } = useGlobalContext();
    console.log(user?.profile.score);
    const trainerScore = (user?.profile.score ?? 0);

    const {
        data,
        refetch,
        loading,
    } = useAppwrite({
        fn: getPaidAppointments,
        // skip: true,
    });




    const rating = useMemo(() => {
        if (!user?.profile?.ratings || user?.profile.ratings.length === 0) return 0;

        const total = user?.profile.ratings.reduce((sum, r) => sum + r.rating, 0);
        return total / user?.profile.ratings.length; // Get average
    }, [user]);

    console.log(rating)

    const totalEarnings = useMemo(() => {
        return data?.reduce((sum, appointment) => sum + computeTrainerIncome(appointment as any), 0) ?? 0;
    }, [data]);


    // Temporary dataset (can be replaced with real API data)
    const trainer = {
        averageRating: 4.5, // Simulating customer rating (out of 5)
    };

    const level = 1 + Math.floor(trainerScore / 5); // Level increases every 5 completed bookings
    const progress = (trainerScore % 5) / 5; // Progress within the level

    return (
        <SafeAreaView className='flex-1 h-full bg-muted'>
            <View className='flex-row items-center justify-start w-full gap-4 py-4 bg-white px-7'>
                <View className='border-2 rounded-full border-primary-light'>
                    <Image src={user?.avatar} className="w-12 h-12 border border-white rounded-full" />
                </View>
                <Text className='text-2xl font-poppinsMedium text-primary'>Hello, {user?.name}</Text>
            </View>
            <View className='flex-row gap-2 py-4 px-7'>
                <View className='flex-1 gap-2 p-4 rounded-xl bg-primary-light'>
                    <Text className='text-xl font-poppins'>Level</Text>
                    <Text className='text-4xl text-left font-poppinsBold'>{level}</Text>
                    <Text className='text-sm font-poppins'>
                        {Math.floor(progress * 5)}/5 completed for next level
                    </Text>
                </View>
                <View className='flex-1 gap-2 p-4 rounded-xl bg-secondary'>
                    <Text className='text-xl font-poppins'>Earnings</Text>
                    <Text className='text-4xl text-left font-poppinsBold'>₱{totalEarnings}</Text>
                </View>
            </View>
        </SafeAreaView>
        // <View className="flex-1 px-6 bg-white">
        //     {/* Header */}
        //     <View className="flex-row items-center py-4 border-b border-gray-200">
        //         {/* Profile Info */}
        //         <Image src={user?.avatar} className="w-16 h-16 rounded-full" />
        //         <View className="ml-4">
        //             <Text className="text-xl font-bold text-primary">{user?.name}</Text>
        //             <Text className="text-sm text-gray-500">Professional Trainer</Text>
        //         </View>
        //     </View>

        //     {/* Level Display */}
        //     <View className="items-center mt-6">
        //         <Text className="text-lg font-semibold">Level {level}</Text>

        //         {/* Progress Bar */}
        //         <View className="w-full h-4 mt-3 bg-gray-300 rounded-full">
        //             <View
        //                 className="h-4 rounded-full bg-primary"
        //                 style={{ width: `${progress * 100}%` }}
        //             />
        //         </View>

        //         {/* Progress Text */}
        //         <Text className="mt-2 text-sm text-gray-500">
        //             {Math.floor(progress * 5)}/5 completed for next level
        //         </Text>
        //     </View>

        //     {/* Average Rating (Below Progress Level) */}
        //     <View className="items-center p-4 mt-6 bg-gray-100 rounded-lg">
        //         <Text className="text-lg font-semibold">Your Rating</Text>
        //         <View className="flex-row items-center mt-2">
        //             <AntDesign name="star" size={20} color="gold" />
        //             <Text className="ml-1 text-lg font-bold text-gray-700">
        //                 {rating.toFixed(1)}
        //             </Text>
        //             <Text className="ml-2 text-gray-500">(Based on customer feedback)</Text>
        //         </View>
        //     </View>
        // </View>
    );
};

export default HomeTrainerMain;
