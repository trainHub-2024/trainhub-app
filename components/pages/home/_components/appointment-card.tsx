import { View, Text, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import { router } from 'expo-router'
import { mapIdToNumber, ParseTime } from '@/lib/utils'
import { Appointment } from '@/types/appwrite.types'
import images from '@/constants/images'

const AppointmentCard = ({ item }: { item: Appointment }) => {
    const number = mapIdToNumber(item.$id)

    const avatar: any = {
        1: images.avatar_1,
        2: images.avatar_2,
        3: images.avatar_3,
        4: images.avatar_4,
    };

    console.log("RATING")
    console.log(item.rating)

    return (
        <TouchableOpacity
            key={item.$id}
            className="p-4 mr-3 border"
            style={{ width: 240, borderRadius: 20, backgroundColor: "#fb8500" }}
            onPress={() => router.push(`/appointments/${item.$id}`)}
        >
            <View className='flex-row items-start justify-between'>
                <View>
                    <Text className="text-lg font-poppinsSemiBold">{new Date(item.date).toDateString()}</Text>
                    <Text className="text-sm font-poppins">
                        {item?.timeSlot} {item?.rating ? `- ${item?.rating?.rating} star` : ``}
                    </Text>
                </View>
                <Image
                    style={{ width: 65, height: 65 }}
                    alt='avatar'
                    source={avatar[number]}
                    resizeMode='contain'
                />
            </View>
            <Text className="mt-2 uppercase">${item.price}</Text>
            <View className="items-start justify-end flex-1">
                <Text className='text-2xl text-white font-poppinsBold'>
                    {item.trainerProfile.name}
                </Text>
            </View>
        </TouchableOpacity>
    )
}

export default AppointmentCard