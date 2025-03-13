import { View, Text } from 'react-native'
import React from 'react'
import { Appointment } from '@/types/appwrite.types'

const EarningsCard = ({ data }: { data: Appointment }) => {

    const duration = data.duration ?? 1;
    const COMMISSIONS: any = {
        1: 0.25,
        2: 0.3,
        3: 0.35,
        4: 0.40,
        default: 0.4,
    };

    const rate = COMMISSIONS[duration] ?? COMMISSIONS.default;

    const session_fee = duration * data.price;
    const commission_fee = session_fee * rate;
    const transaction_fee = 25;

    const trainer_income = (session_fee - commission_fee - transaction_fee);


    return (
        <View className='px-4 py-6 mt-4 bg-white rounded-lg'>
            <Text className='text-2xl font-poppinsBold text-primary'>{data.userProfile.name}
            </Text>
            <Text className='font-poppinsBold'>{new Date(data.date).toDateString()} - {data.timeSlot}</Text>
            <Text className='font-poppins text-muted-foreground'>{data.duration ?? 1} hr/s</Text>
            <Text className='font-poppins text-muted-foreground'>{data.venue}</Text>
            <View className='gap-0 mt-4'>
                <View className='flex-row items-center justify-between w-full'>
                    <Text className='text-sm text-muted-foreground font-poppins'>Session Fee</Text>
                    <Text className='font-poppinsBold'>₱{session_fee}</Text>
                </View>
                <View className='flex-row items-center justify-between w-full'>
                    <Text className='text-sm text-muted-foreground font-poppins'>Commission Fee</Text>
                    <Text className='text-red-500 font-poppinsBold'>- ₱{commission_fee}</Text>
                </View>
                <View className='flex-row items-center justify-between w-full'>
                    <Text className='text-sm text-muted-foreground font-poppins'>Transaction Fee</Text>
                    <Text className='text-red-500 font-poppinsBold'>- ₱{transaction_fee}</Text>
                </View>
                <View className='flex-row items-center justify-between w-full'>
                    <Text className='text-sm text-muted-foreground font-poppins'>Method</Text>
                    <Text className='text-sm capitalize font-poppins'>{data.paymentMethod}</Text>
                </View>
                <View className='flex-row items-center justify-between w-full mt-2'>
                    <Text className='text-sm text-muted-foreground font-poppinsMedium'>Total Receivable</Text>
                    <Text className='text-green-600 font-poppinsBold'>₱{trainer_income}</Text>
                </View>
            </View>
        </View>
    )
}

export default EarningsCard