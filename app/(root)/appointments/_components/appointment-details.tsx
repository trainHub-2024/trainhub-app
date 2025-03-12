import { View, Text, Image } from 'react-native'
import React from 'react'
import { Appointment } from '@/types/appwrite.types'
import { useGlobalContext } from '@/lib/global-provider'
import StatusDetails from './status-details'

const AppointmentDetails = ({ data }: { data: Appointment }) => {
    const { user } = useGlobalContext();

    console.log(data?.sports)

    if (user?.role === "trainer")
        return (
            <View className='w-full px-6 py-6 rounded-xl bg-white flex-row gap-4 justify-start items-center'>
                <View className='relative flex-1'>
                    <Text className='text-primary text-lg font-poppinsBold'>{new Date(data.date).toDateString()} - {data?.timeSlot}</Text>
                    <Text className='font-poppinsBold'>₱{data?.trainerProfile?.trainerProfile_id?.trainingPrice}</Text>
                    <Text className='font-poppins text-sm text-muted-foreground'>{data?.trainerProfile?.trainerProfile_id.contactNumber}</Text>
                    <Text className='font-poppins text-sm text-muted-foreground'>Venue: {data?.venue ?? "To be announced"}</Text>
                    <Text className='font-poppins text-sm text-muted-foreground'>Duration: {data?.duration ? `${data?.duration} hr/s` : "To be announced"}</Text>

                    <View className='absolute bottom-0 right-0'>
                        <StatusDetails status={data?.status as any} />
                    </View>
                </View>
            </View>
        )
}

export default AppointmentDetails