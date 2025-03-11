import { View, Text, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import { useGlobalContext } from '@/lib/global-provider';
import { format } from 'date-fns';
import { Ionicons } from "@expo/vector-icons"
import { router } from 'expo-router';

const TraineeHeader = () => {
    const { user } = useGlobalContext();

    return (
        <View className="flex-row items-center justify-between">
            <View className="flex-row items-center gap-2">
                <Image
                    source={{ uri: user?.avatar ?? "" }}
                    className="border rounded-full size-12 border-primary"
                    resizeMode="cover"
                />
            </View>
            <View className='items-center justify-center flex-1'>
                <Text className="text-xl capitalize text-primary font-poppinsMedium">Hi, {user?.name}!</Text>
                <Text className="text-sm font-poppins">{format(new Date(), "MMM dd")}</Text>
            </View>
            <TouchableOpacity onPress={() => router.push("/explore")} style={{ padding: 4 }} className='flex items-center justify-center border rounded-full border-primary size-12'>
                <Ionicons name="search" size={22} style={{ color: "#f97316" }} />
            </TouchableOpacity>
        </View>
    )
}

export default TraineeHeader