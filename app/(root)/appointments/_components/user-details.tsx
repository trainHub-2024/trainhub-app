import { View, Text, Image } from 'react-native'
import React from 'react'
import { Appointment } from '@/types/appwrite.types'
import { useGlobalContext } from '@/lib/global-provider'

const UserDetails = ({ data }: { data: Appointment }) => {
    const { user } = useGlobalContext();

    console.log(data?.trainerProfile)

    const contactNumber = data.status === "pending" ? `${data?.trainerProfile?.trainerProfile_id?.contactNumber?.substring(0, 2)}xx xxx xxxx` : data?.trainerProfile?.trainerProfile_id?.contactNumber

    if (user?.role === "trainer")
        return (
            <View className='w-full px-6 py-6 rounded-xl bg-white flex-row gap-4 justify-between items-center'>
                <View>
                    <Text className='text-primary text-lg font-poppinsBold'>TRAINEE INFORMATION</Text>
                    <Text className='font-poppinsBold'>{data?.userProfile?.username}</Text>
                    <Text className='font-poppins text-sm text-muted-foreground'>{data?.userProfile?.userProfile_id.location}</Text>
                    <Text className='font-poppins text-sm text-muted-foreground'>{data?.userProfile?.userProfile_id.contactNumber}</Text>
                </View>
                <View className='rounded-full size-20 border-2 border-primary'>
                    <Image
                        source={{ uri: data?.userProfile?.avatar ?? "" }}
                        className="border rounded-full size-full border-white"
                        resizeMode="cover"
                    />
                </View>
            </View>
        )
    else if (user?.role === "trainee")
        return (
            <View className='w-full px-6 py-6 rounded-xl bg-white flex-row gap-4 justify-between items-center'>
                <View>
                    <Text className='text-primary text-lg font-poppinsBold'>TRAINER INFORMATION</Text>
                    <Text className='font-poppinsBold'>{data?.trainerProfile?.username}</Text>
                    <Text className='font-poppins text-sm text-muted-foreground'>{data?.trainerProfile?.trainerProfile_id.location}</Text>
                    <Text className='font-poppins text-sm text-muted-foreground'>{contactNumber}</Text>
                </View>
                <View className='rounded-full size-20 border-2 border-primary'>
                    <Image
                        source={{ uri: data?.trainerProfile?.avatar ?? "" }}
                        className="border rounded-full size-full border-white"
                        resizeMode="cover"
                    />
                </View>
            </View>
        )
}

export default UserDetails