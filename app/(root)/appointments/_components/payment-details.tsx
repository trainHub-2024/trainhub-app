import { View, Text, Image } from 'react-native'
import React from 'react'
import { Appointment } from '@/types/appwrite.types'

const PaymentDetails = ({ data }: { data: Appointment }) => {
    return (
        <View className='w-full px-6 py-6 rounded-xl bg-white flex-row gap-4 justify-start items-center'>
            <View>
                <Text className='text-primary text-lg font-poppinsBold'>Payment Details</Text>
                <Text className='font-poppinsBold'>Date:
                    <Text className='capitalize'> {data?.paymentDate ? new Date(data.paymentDate).toLocaleDateString() : "N/A"}</Text>
                </Text>
                <Text className='font-poppins text-sm text-muted-foreground'>Method: {data?.paymentMethod ?? "N/A"}</Text>
                {data?.paymentImage && (
                    <Image
                        source={{ uri: data?.paymentImage }}
                        resizeMode="cover"
                        className="rounded-md size-24"
                    />
                )}
            </View>
        </View>
    )
}

export default PaymentDetails