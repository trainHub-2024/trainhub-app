import { View, Text, Image } from 'react-native'
import React from 'react'
import { Appointment } from '@/types/appwrite.types'
import { useGlobalContext } from '@/lib/global-provider'

const UserDetails = ({ data }: { data: Appointment }) => {
    const { user } = useGlobalContext();

    console.log(data?.userProfile)

    if (user?.role === "trainer")
        return (
            <View className='w-full px-6 py-6 rounded-xl bg-white flex-row gap-4 justify-between items-center'>
                <View>
                    <Text className='text-primary text-lg font-poppinsBold'>TRAINEE</Text>
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
}

export default UserDetails