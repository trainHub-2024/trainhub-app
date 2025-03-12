import { View, Text } from 'react-native'
import React from 'react'
import { Appointment } from '@/types/appwrite.types'

const PaymentDetails = ({ data }: { data: Appointment }) => {

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
        <View>
            <Text>DURATION: {duration} hour/s</Text>
            <Text>COMMISSION: ₱{commission_fee}</Text>
            <Text>TRANSACTION FEE: ₱{transaction_fee}</Text>
            <Text>TRAINER INCOME: ₱{trainer_income}</Text>
        </View>
    )
}

export default PaymentDetails