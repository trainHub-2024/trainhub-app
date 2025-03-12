import { View, Text } from 'react-native'
import React from 'react'

const StatusDetails = ({ status }: { status: "pending" | "completed" | "cancelled" | "confirmed" }) => {
    const STATUS_VIEW_STYLE = {
        "pending": "bg-violet-300",
        "completed": "bg-slate-300",
        "cancelled": "bg-red-300",
        "confirmed": "bg-green-300",
    }

    const STATUS_TEXT_STYLE = {
        "pending": "text-violet-600",
        "completed": "text-slate-600",
        "cancelled": "text-red-600",
        "confirmed": "text-green-600",
    }

    return (
        <View className={`w-full px-2 py-2 rounded-xl ${STATUS_VIEW_STYLE[status]}`}>
            <Text className={`uppercase font-poppinsBold text-sm text-center ${STATUS_TEXT_STYLE[status]}`}>{status}</Text>
        </View>
    )
}

export default StatusDetails