import { View, Text, Image } from 'react-native';
import React, { useEffect, useMemo, useState } from 'react';
import { useGlobalContext } from '@/lib/global-provider';
import AntDesign from '@expo/vector-icons/AntDesign';

const HomeTrainerMain = () => {
    const { user } = useGlobalContext();
    console.log(user?.profile.score);
    const trainerScore = (user?.profile.score ?? 0);


    const rating = useMemo(() => {
        if (!user?.profile?.ratings || user?.profile.ratings.length === 0) return 0;

        const total = user?.profile.ratings.reduce((sum, r) => sum + r.rating, 0);
        return total / user?.profile.ratings.length; // Get average
    }, [user]);

    console.log(rating)


    // Temporary dataset (can be replaced with real API data)
    const trainer = {
        averageRating: 4.5, // Simulating customer rating (out of 5)
    };

    const level = 1 + Math.floor(trainerScore / 5); // Level increases every 5 completed bookings
    const progress = (trainerScore % 5) / 5; // Progress within the level

    return (
        <View className="flex-1 px-6 bg-white">
            {/* Header */}
            <View className="flex-row items-center py-4 border-b border-gray-200">
                {/* Profile Info */}
                <Image src={user?.avatar} className="w-16 h-16 rounded-full" />
                <View className="ml-4">
                    <Text className="text-xl font-bold text-primary">{user?.name}</Text>
                    <Text className="text-sm text-gray-500">Professional Trainer</Text>
                </View>
            </View>

            {/* Level Display */}
            <View className="items-center mt-6">
                <Text className="text-lg font-semibold">Level {level}</Text>

                {/* Progress Bar */}
                <View className="w-full h-4 mt-3 bg-gray-300 rounded-full">
                    <View
                        className="h-4 rounded-full bg-primary"
                        style={{ width: `${progress * 100}%` }}
                    />
                </View>

                {/* Progress Text */}
                <Text className="mt-2 text-sm text-gray-500">
                    {Math.floor(progress * 5)}/5 completed for next level
                </Text>
            </View>

            {/* Average Rating (Below Progress Level) */}
            <View className="items-center p-4 mt-6 bg-gray-100 rounded-lg">
                <Text className="text-lg font-semibold">Your Rating</Text>
                <View className="flex-row items-center mt-2">
                    <AntDesign name="star" size={20} color="gold" />
                    <Text className="ml-1 text-lg font-bold text-gray-700">
                        {rating.toFixed(1)}
                    </Text>
                    <Text className="ml-2 text-gray-500">(Based on customer feedback)</Text>
                </View>
            </View>
        </View>
    );
};

export default HomeTrainerMain;
