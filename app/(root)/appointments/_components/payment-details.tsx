import { View, Text, Image } from 'react-native'
import React from 'react'
import { Appointment } from '@/types/appwrite.types'
import { useGlobalContext } from '@/lib/global-provider'

const PaymentDetails = ({ data }: { data: Appointment }) => {
    const { user } = useGlobalContext();
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

    const isPaid = data.paymentDate ? true : false;

    return (
        <View className='w-full px-6 py-6 rounded-xl bg-white flex-row gap-4 justify-start items-center'>
            <View>
                <Text className='text-primary text-lg font-poppinsBold'>Payment Details</Text>
                <Text className='font-poppinsBold'>Date:
                    <Text className='capitalize'> {data?.paymentDate ? new Date(data.paymentDate).toLocaleDateString() : "N/A"}</Text>
                </Text>
                <Text className='font-poppins text-sm text-muted-foreground mb-2'>Method: {data?.paymentMethod ?? "N/A"}</Text>
                {isPaid && user?.role === "trainer" && (
                    <View className='gap-0'>
                        <View className='w-full flex-row justify-between items-center'>
                            <Text className='text-sm text-muted-foreground font-poppins'>Session Fee</Text>
                            <Text className='font-poppinsBold'>₱{session_fee}</Text>
                        </View>
                        <View className='w-full flex-row justify-between items-center'>
                            <Text className='text-sm text-muted-foreground font-poppins'>Commission Fee</Text>
                            <Text className='font-poppinsBold text-red-500'>- ₱{commission_fee}</Text>
                        </View>
                        <View className='w-full flex-row justify-between items-center'>
                            <Text className='text-sm text-muted-foreground font-poppins'>Transaction Fee</Text>
                            <Text className='font-poppinsBold text-red-500'>- ₱{transaction_fee}</Text>
                        </View>
                        <View className='w-full flex-row justify-between items-center mt-2'>
                            <Text className='text-sm text-muted-foreground font-poppinsMedium'>Total Receivable</Text>
                            <Text className='font-poppinsBold text-green-600'>₱{trainer_income}</Text>
                        </View>
                    </View>
                )}
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